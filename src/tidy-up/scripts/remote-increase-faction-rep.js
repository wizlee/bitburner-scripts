/** @param {NS} ns **/
export async function main(ns) {
    const currHost = ns.getHostname();
    const destHost = ns.args[0];
    const deployScript = "deploy-single-with-max-thread.js";
    const remoteScript =  "increase-faction-reputation.js";

    await ns.scp(remoteScript, currHost, destHost);
    await ns.exec(deployScript, currHost, 1, destHost, remoteScript);
}