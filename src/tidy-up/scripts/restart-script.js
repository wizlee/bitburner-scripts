/** @param {NS} ns **/
export async function main(ns) {
    // await killAllRemoteScripts(ns);
    // const runningScript = "basic-hack.js";
    // const serverName = "home";
    // let scriptKilled = false;
    // if (ns.scriptRunning(runningScript, serverName)) {
    //     scriptKilled = await ns.scriptKill(runningScript, serverName);
    // }
    // if (scriptKilled)  {
    //     ns.print(`${runningScript} killed in ${serverName}`);
    // }

    const currHost = ns.getHostname();
    if (currHost != "home") {
        ns.print(`this script is designed to run in home. `);
        return;
    }

    // const deployScript = "deploy-single-with-max-thread.js";
    // const hackTargets = ns.args.slice(1);
    // let currTarget = hackTargets[0];
    // if (hackTargets.length > 1) {
    //     currTarget = hackTargets.join(',');
    // }

    const deployScript = "simple-distributed-hack.js";
    const hackScript =  "basic-hack.js";
    const serversToRestart = [
        "home",
        // "home-3",
        // "home-4",
        // "home-5",
        // "home-6",
        // "home-7",
        // "home-8",
        // "home-9",
        // "home-10",
        // "home-11",
        // "home-12",
        // "home-13",
        // "home-14",
        // "home-15",
        // "home-16",
        // "home-17",
        // "home-18",
        // "home-19",
        // "home-20",
        // "home-21",
        // "home-22",
        // "home-23",
        // "home-24",
    ];

    const threadNum = 250;
    for (let i = 0; i < serversToRestart.length; ++i) {
        const destHost = serversToRestart[i];
        await ns.scp(hackScript, currHost, destHost);
        ns.tprint(`>>>>>> copied hack script to Server: ${destHost}`);
        // await ns.exec(deployScript, currHost, 1, destHost, hackScript, currTarget);
        await ns.exec(deployScript, currHost, 1, destHost, threadNum);
        await ns.sleep(4000); // to avoid wasting time on hacking empty n00dles
    }
}

/** @param {NS} ns **/
async function killAllRemoteScripts(ns) {
    const runningScript = "basic-hack.js";
    let purchasedServerList = ns.getPurchasedServers();
    for (let i = 0; i < purchasedServerList.length; i++) {
        const serverName = purchasedServerList[i];
        let scriptKilled = false;
        if (ns.scriptRunning(runningScript, serverName)) {
            scriptKilled = await ns.scriptKill(runningScript, serverName);
        }
        if (scriptKilled)  {
            ns.print(`${runningScript} killed in ${serverName}`);
        }
    }
}