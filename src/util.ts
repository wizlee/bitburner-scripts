import { NS } from "@ns";

export function findServer(ns: NS, serverToFind: string): void {
    const servers = getAllServers(ns);
    if (servers.includes(serverToFind)) {
        ns.tprint(`[${localeHHMMSS()}] Path to ${serverToFind} found:`);
        ns.tprint(printPathToServer(servers, serverToFind));
    } else {
        ns.tprint(
            `[${localeHHMMSS()}] Unable to find the path to ${serverToFind}`
        );
    }
}

export function listSpecialServers(ns: NS): void {
    const servers = getAllServers(ns);
    ns.tprint(`[${localeHHMMSS()}] Special servers:`);
    ns.tprint(`* CSEC (CyberSec faction)`);
    ns.tprint(printPathToServer(servers, "CSEC") + "; hack;");
    ns.tprint("");
    ns.tprint(`* avmnite-02h (NiteSec faction)`);
    ns.tprint(printPathToServer(servers, "avmnite-02h") + "; hack;");
    ns.tprint("");
    ns.tprint(`* I.I.I.I (The Black Hand faction)`);
    ns.tprint(printPathToServer(servers, "I.I.I.I") + "; hack;");
    ns.tprint("");
    ns.tprint(`* run4theh111z (Bitrunners faction)`);
    ns.tprint(printPathToServer(servers, "run4theh111z") + "; hack;");
    ns.tprint("");
    ns.tprint(`* w0r1d_d43m0n`);
    ns.tprint(printPathToServer(servers, "w0r1d_d43m0n") + "; hack;");
    ns.tprint("");
}

export function printContractsLocation(ns: NS): void {
    const servers = getAllServers(ns);
    ns.tprint(`[${localeHHMMSS()}] Looking for servers with coding contracts:`);
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
                    printPathToServer(servers, hostname) + `; run ${contract};`
                );
            }
        }
    });
    ns.tprint("");
}

export function getAllServers(ns: NS): Array<string> {
    const servers = ["home"];
    const routes = { home: ["home"] };
    // Scan all servers and keep track of the path to get to them
    ns.disableLog("scan");
    for (let i = 0, j; i < servers.length; i++) {
        for (j of ns.scan(servers[i])) {
            if (!servers.includes(j)) {
                servers.push(j);
                routes[j] = routes[servers[i]].slice();
                routes[j].push(j);
            }
        }
    }

    return servers;
}

export function printPathToServer(
    servers: Array<string>,
    serverToFind: string
): string {
    if (serverToFind === "home") return "home";
    if (!servers[serverToFind]) return `-- Unable to locate ${serverToFind} --`;

    const jumps = [];

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

    return jumps.reverse().join("; connect ");
}

export function terminalCommand(message: string): void {
    const docs = globalThis["document"];
    const terminalInput =
        /** @type {HTMLInputElement} */ docs.getElementById("terminal-input");
    terminalInput.value = message;
    const handler = Object.keys(terminalInput)[1];
    terminalInput[handler].onChange({ target: terminalInput });
    terminalInput[handler].onKeyDown({
        keyCode: 13,
        preventDefault: () => null,
    });
}

export function localeHHMMSS(ms = 0): string {
    if (!ms) {
        ms = new Date().getTime();
    }

    return new Date(ms).toLocaleTimeString();
}

// source: https://www.html-code-generator.com/javascript/shorten-long-numbers
export function numToHumanString(num: number): string {
    num = num.toString().replace(/[^0-9.]/g, "");
    if (num < 1000) {
        return num;
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
