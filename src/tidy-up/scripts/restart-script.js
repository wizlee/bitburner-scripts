/** @param {NS} ns **/
export async function main(ns) {
    const currHost = ns.getHostname();
    if (currHost != "home") {
        ns.print(`this script is designed to run in home. `);
        return;
    }
    const deployScript = "simple-distributed-hack.js";
    const hackScript =  "basic-hack.js";
    const serversToRestart = [
        "home-6",
        "home-7",
        "home-8",
        "home-9",
        "home-10",
        "home-11",
        "home-12",
        "home-13",
        "home-22",
        "home-23",
        "home-24",
    ];

    const threadNum = 250;
    for (let i = 0; i < serversToRestart.length; ++i) {
        const destHost = serversToRestart[i];
        await ns.scp(hackScript, currHost, destHost);
        ns.tprint(`>>>>>> copied hack script to Server: ${destHost}`);
        await ns.exec(deployScript, currHost, 1, destHost, threadNum);
        await ns.sleep(4000); // to avoid wasting time on hacking empty n00dles
    }
}