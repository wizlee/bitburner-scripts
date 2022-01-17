/** @param {NS} ns **/
export async function main(ns) {
    const hackScript = "basic-hack.js"; // ns.args[0], hack-or-grow-all-early-servers.js etc
    const deployScript = "deploy-single-with-max-thread.js";
    const currHost = "home";
    const serversWithRam = ["silver-helix",
                            "phantasy",
                            "omega-net",
                            "avmnite-02h",
                            "the-hub"]; // note this requires ~lvl 320-329

    const serversWithoutRam = ["johnson-ortho",
                            "crush-fitness"];

    for (var i = 0; i < serversWithRam.length; i++) {
        var serv = serversWithRam[i];

        await ns.scp(hackScript, serv);
        await ns.brutessh(serv);
        await ns.ftpcrack(serv);
        await ns.nuke(serv);
        await ns.exec(deployScript, currHost, 1, serv, hackScript, "joesguns");
    } 

    // only get root access for servers without ram
    for (var i = 0; i < serversWithoutRam.length; i++) {
        var serv = serversWithoutRam[i];
        await ns.brutessh(serv);
        await ns.ftpcrack(serv);
        await ns.nuke(serv);
    }
}