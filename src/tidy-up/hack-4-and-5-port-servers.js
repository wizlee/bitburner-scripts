/** @param {NS} ns **/
// requires hacking level ~530 - ~950 IF going to hack its money
export async function main(ns) {
    const hackScript = "basic-hack.js";
    const deployScript = "deploy-single-with-max-thread.js";
    const nukeAllScript = "nuke-all.js";
    const currHost = "home";
    const serversWithRam = ["aevum-police",
        "alpha-ent",
        "lexo-corp",
        "global-pharm",
        "univ-energy",
        "unitalife",
        "zb-institute",
        "omnia",
        "solaris"];

    await ns.run(nukeAllScript, 1);

    for (var i = 0; i < serversWithRam.length; i++) {
        var serv = serversWithRam[i];

        await ns.scp(hackScript, serv);
        await ns.exec(deployScript, currHost, 1, serv, hackScript, "sigma-cosmetics");
    }
}