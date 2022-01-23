import { PORT } from "./const";

/**
 * @description
 * An utility class writen as a singleton class to avoid the need to pass in
 * the NS object into every function.
 */
export class Util {
    private static instance?: Util;
    private ns: NS;
    servers: string[] = ["home"];
    routes: Route = { home: ["home"] };

    private constructor(ns: NS) {
        if (Util.instance)
            throw new Error("Use Singleton.getInstance instead of new.");
        this.ns = ns;
    }

    static async getInstance(ns: NS): Promise<Util> {
        if (!Util.instance) {
            Util.instance = new Util(ns);
        }

        if (!(await Util.instance.scanServers())) {
            throw new Error("Unable to scan servers.");
        }
        return Util.instance;
    }

    findServer(serverToFind: string): void {
        if (this.servers.includes(serverToFind)) {
            this.ns.tprint(
                `[${this.localeHHMMSS()}] Path to ${serverToFind} found:`
            );
            this.ns.tprint(this.printPathToServer(serverToFind));
        } else {
            this.ns.tprint(
                `[${this.localeHHMMSS()}] Unable to find the path to ${serverToFind}`
            );
        }
    }

    listSpecialServers(): void {
        this.ns.tprint(`[${this.localeHHMMSS()}] Special servers:`);
        this.ns.tprint(`* CSEC (CyberSec faction)`);
        this.ns.tprint(this.printPathToServer("CSEC") + "; hack;");
        this.ns.tprint("");
        this.ns.tprint(`* avmnite-02h (NiteSec faction)`);
        this.ns.tprint(this.printPathToServer("avmnite-02h") + "; hack;");
        this.ns.tprint("");
        this.ns.tprint(`* I.I.I.I (The Black Hand faction)`);
        this.ns.tprint(this.printPathToServer("I.I.I.I") + "; hack;");
        this.ns.tprint("");
        this.ns.tprint(`* run4theh111z (Bitrunners faction)`);
        this.ns.tprint(this.printPathToServer("run4theh111z") + "; hack;");
        this.ns.tprint("");
        this.ns.tprint(`* w0r1d_d43m0n`);
        this.ns.tprint(this.printPathToServer("w0r1d_d43m0n") + "; hack;");
        this.ns.tprint("");
    }

    printContractsLocation(): void {
        this.ns.tprint(
            `[${this.localeHHMMSS()}] Looking for servers with coding contracts:`
        );
        this.servers.forEach((hostname) => {
            const files = this.ns.ls(hostname);
            if (files && files.length) {
                const contract = files.find((file) => file.includes(".cct"));

                if (contract) {
                    this.ns.tprint("");
                    this.ns.tprint(
                        `* ${hostname} has a coding contract(s)! Connect using:`
                    );
                    this.ns.tprint(
                        `${this.printPathToServer(hostname)}; run ${contract};`
                    );
                }
            }
        });
        this.ns.tprint("");
    }

    /**
     * Scan the game for all servers and save them into ports.
     *
     * @returns `true` if success, `false` if encountered any errors.
     */
    async scanServers(): Promise<boolean> {
        let success = true;
        if (this.isServersScanned()) {
            return success;
        }

        // Scan all servers and keep track of the path to get to them
        this.ns.disableLog("scan");
        for (let i = 0, server; i < this.servers.length; i++) {
            for (server of this.ns.scan(this.servers[i])) {
                if (!this.servers.includes(server)) {
                    this.servers.push(server);
                    this.routes[server] = this.routes[this.servers[i]].slice();
                    this.routes[server].push(server);
                }
            }
        }

        if (!(await this.ns.tryWritePort(PORT.SERVERS, this.servers))) {
            this.ns.tprint(
                `[${this.localeHHMMSS()}] Fail to write the new servers data to the port`
            );
            success = false;
        }

        if (!(await this.ns.tryWritePort(PORT.ROUTES, this.routes))) {
            this.ns.tprint(
                `[${this.localeHHMMSS()}] Fail to write the new routes data to the port`
            );
            success = false;
        }

        return success;
    }

    isServersScanned(): boolean {
        const routesPortData: Route | string = this.ns.peek(PORT.ROUTES);
        const serversPortData: string[] | string = this.ns.peek(PORT.SERVERS);

        if (
            routesPortData === "NULL PORT DATA" ||
            serversPortData === "NULL PORT DATA"
        ) {
            return false;
        } else {
            this.servers = serversPortData as string[];
            this.routes = routesPortData as Route;
            return true;
        }
    }

    /**
     * This function is used to print the path to a server in the form of a single line command.
     *
     * @param serverToFind name of the server to find
     * @returns a single line command to connect to the server.
     *          If the server is not found, returns an empty string.
     */
    printPathToServer(serverToFind: string): string {
        let pathToServer = "";
        if (serverToFind === "home") return serverToFind;

        const jumps = [];

        let currentParent = this.getServerParent(serverToFind);
        const isParentHome = () => {return currentParent === "home";};
        while (!isParentHome) {
            jumps.push(currentParent);
            currentParent = this.getServerParent(currentParent);
        }

        jumps.unshift(serverToFind);
        if (jumps.length > 1) {
            pathToServer = `connect ${jumps.reverse().join("; connect ")}`;
        } else {
            pathToServer = `connect ${serverToFind}`;
        }

        return pathToServer;
    }

    getServerParent(server: string): string {
        for (const parent in this.routes) {
            if (this.routes[parent].includes(server)) {
                return parent;
            }
        }
        throw new Error("Server parent not found. Are you sure the server exists?");
    }

    terminalCommand(message: string): void {
        const docs = globalThis["document"];
        const terminalInput: HTMLInputElement | null = docs.getElementById(
            "terminal-input"
        ) as HTMLInputElement;
        if (terminalInput) {
            terminalInput.value = message;
            const handler = Object.keys(
                terminalInput
            )[1] as keyof HTMLInputElement;
            (<HTMLInputElement>terminalInput[handler])?.onchange?.({
                target: terminalInput,
            } as unknown as Event);
            // (<HTMLInputElement>terminalInput[handler])?.onchange = (
            //     e: InputEvent
            // ) => {
            //     e.currentTarget = terminalInput;
            // };
            (<HTMLInputElement>terminalInput[handler])?.onkeydown?.({
                keyCode: 13,
                preventDefault: () => null,
            } as unknown as KeyboardEvent);
        }
    }

    localeHHMMSS(ms = 0): string {
        if (!ms) {
            ms = new Date().getTime();
        }

        return new Date(ms).toLocaleTimeString();
    }

    // source: https://www.html-code-generator.com/javascript/shorten-long-numbers
    numToHumanString(num: number): string {
        num = parseInt(num.toString().replace(/[^0-9.]/g, ""));
        if (num < 1000) {
            return num.toString();
        }
        const si = [
            { v: 1e3, s: "K" },
            { v: 1e6, s: "M" },
            { v: 1e9, s: "B" },
            { v: 1e12, s: "T" },
            { v: 1e15, s: "P" },
            { v: 1e18, s: "E" },
        ];
        let index;
        for (index = si.length - 1; index > 0; index--) {
            if (num >= si[index].v) {
                break;
            }
        }
        return (
            (num / si[index].v)
                .toFixed(2)
                .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[index].s
        );
    }
}


