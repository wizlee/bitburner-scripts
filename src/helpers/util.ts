import { NS } from "@ns";
import { Route } from "@types";
import { GLOBAL } from "./const";

/**
 * @description
 * An utility class writen as a singleton class to avoid the need to pass in
 * the NS object into every function.
 */
export class Util {
    private static instance?: Util;
    private static ns: NS;

    private constructor() {
        if (Util.instance)
            throw new Error("Use Singleton.getInstance instead of new.");
    }

    public static getInstance(ns: NS): Util {
        this.ns = ns;
        return this.instance || (this.instance = new Util());
    }

    async findServer(ns: NS, serverToFind: string): Promise<void> {
        const servers = await Util.getAllServers(ns);
        if (servers.includes(serverToFind)) {
            ns.tprint(
                `[${Util.localeHHMMSS()}] Path to ${serverToFind} found:`
            );
            ns.tprint(Util.printPathToServer(serverToFind));
        } else {
            ns.tprint(
                `[${Util.localeHHMMSS()}] Unable to find the path to ${serverToFind}`
            );
        }
    }

    async listSpecialServers(ns: NS): Promise<void> {
        if (await scanServers(ns)) {
            ns.tprint(`[${localeHHMMSS()}] Special servers:`);
            ns.tprint(`* CSEC (CyberSec faction)`);
            ns.tprint(printPathToServer(ns, "CSEC") + "; hack;");
            ns.tprint("");
            ns.tprint(`* avmnite-02h (NiteSec faction)`);
            ns.tprint(printPathToServer(ns, "avmnite-02h") + "; hack;");
            ns.tprint("");
            ns.tprint(`* I.I.I.I (The Black Hand faction)`);
            ns.tprint(printPathToServer(ns, "I.I.I.I") + "; hack;");
            ns.tprint("");
            ns.tprint(`* run4theh111z (Bitrunners faction)`);
            ns.tprint(printPathToServer(ns, "run4theh111z") + "; hack;");
            ns.tprint("");
            ns.tprint(`* w0r1d_d43m0n`);
            ns.tprint(printPathToServer(ns, "w0r1d_d43m0n") + "; hack;");
            ns.tprint("");
        }
    }

    async printContractsLocation(ns: NS): void {
        const servers = getAllServers(ns);
        ns.tprint(
            `[${localeHHMMSS()}] Looking for servers with coding contracts:`
        );
        servers.forEach((hostname) => {
            const files = ns.ls(hostname);
            if (files && files.length) {
                const contract = files.find((file) => file.includes(".cct"));

                if (contract) {
                    ns.tprint("");
                    ns.tprint(
                        `* ${hostname} has a coding contract(s)! Connect using:`
                    );
                    ns.tprint(
                        printPathToServer(servers, hostname) +
                            `; run ${contract};`
                    );
                }
            }
        });
        ns.tprint("");
    }

    /**
     * Scan and return all servers in the game.
     *
     * @returns If success, returns an array of all servers in the game.
     *         If failure, returns an empty array.
     */
    async getAllServers(ns: NS): Array<string> {
        let servers: Array<string> = [];

        if (await scanServers(ns)) servers = ns.peek(GLOBAL.SERVERS);

        return servers;
    }

    /**
     * Scan the game for all servers and save them into ports.
     *
     * @returns `true` if success, `false` if encountered any errors.
     */
    async scanServers(ns: NS): boolean {
        let success = true;
        if (isServersScanned(ns)) {
            return success;
        }

        const servers: Array<string> = ["home"];
        const routes: Route = { home: ["home"] };
        // Scan all servers and keep track of the path to get to them
        ns.disableLog("scan");
        for (let i = 0, server; i < servers.length; i++) {
            for (server of ns.scan(servers[i])) {
                if (!servers.includes(server)) {
                    servers.push(server);
                    routes[server] = routes[servers[i]].slice();
                    routes[server].push(server);
                }
            }
        }

        if (!(await ns.tryWritePort(GLOBAL.SERVERS, servers))) {
            ns.tprint(
                `[${localeHHMMSS()}] Fail to write the new servers data to the port`
            );
            success = false;
        }

        if (!(await ns.tryWritePort(GLOBAL.ROUTES, routes))) {
            ns.tprint(
                `[${localeHHMMSS()}] Fail to write the new routes data to the port`
            );
            success = false;
        }

        return success;
    }

    async isServersScanned(ns: NS): boolean {
        const routesPortData: Route | string = ns.peek(GLOBAL.ROUTES);
        const serversPortData: Array<string> | string = ns.peek(GLOBAL.SERVERS);

        if (
            routesPortData === "NULL PORT DATA" ||
            serversPortData === "NULL PORT DATA"
        ) {
            return false;
        }
        return true;
    }

    /**
     * This function is used to print the path to a server in the form of a single line command.
     * **It ASSUMES that the servers are already scanned**.
     *
     * @param ns
     * @param serverToFind name of the server to find
     * @returns a single line command to connect to the server.
     *          If the server is not found, returns an empty string.
     */
    async printPathToServer(ns: NS, serverToFind: string): string {
        let pathToServer = "";
        if (serverToFind === "home") return serverToFind;

        const jumps = [];
        const servers: Array<string> = ns.peek(GLOBAL.SERVERS);
        const routes: Route = ns.peek(GLOBAL.ROUTES);

        let isParentHome = servers.parent === "home";
        let currentServer = serverToFind;

        while (!isParentHome) {
            jumps.push(servers[currentServer].parent);

            if (servers[currentServer].parent !== "home") {
                currentServer = servers[currentServer].parent;
            } else {
                isParentHome = true;
            }
        }

        jumps.unshift(serverToFind);
        if (jumps.length > 1) {
            pathToServer = `connect ${jumps.reverse().join("; connect ")}`;
        } else {
            pathToServer = `connect ${serverToFind}`;
        }

        return pathToServer;
    }

    terminalCommand(message: string): void {
        const docs = globalThis["document"];
        const terminalInput: HTMLInputElement | null = docs.getElementById(
            "terminal-input"
        ) as HTMLInputElement;
        if (terminalInput) {
            terminalInput.value = message;
            const handler = Object.keys(terminalInput)[1] as keyof HTMLInputElement;
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

