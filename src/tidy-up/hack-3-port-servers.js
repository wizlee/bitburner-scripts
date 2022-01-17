/** @param {NS} ns **/
// requires hacking level ~400 - ~520
export async function main(ns) {
    const hackScript = "basic-hack.js";
    const deployScript = "deploy-single-with-max-thread.js";
    const currHost = "home";
    const serversWithRam = ["catalyst",
        "rothman-uni",
        "summit-uni",
        "netlink",
        "I.I.I.I",
        "millenium-fitness",
        "rho-construction"];

    const serversWithoutRam = ["comptek"];

    for (var i = 0; i < serversWithRam.length; i++) {
        var serv = serversWithRam[i];

        await ns.scp(hackScript, serv);
        await ns.brutessh(serv);
        await ns.ftpcrack(serv);
        await ns.relaysmtp(serv);
        await ns.nuke(serv);
        await ns.exec(deployScript, currHost, 1, serv, hackScript, "joesguns");
    }

    // only get root access for servers without ram
    for (var i = 0; i < serversWithoutRam.length; i++) {
        var serv = serversWithoutRam[i];
        await ns.brutessh(serv);
        await ns.ftpcrack(serv);
        await ns.relaysmtp(serv);
        await ns.nuke(serv);
    }
}
