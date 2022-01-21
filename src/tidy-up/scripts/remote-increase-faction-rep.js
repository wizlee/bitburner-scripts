/** @param {NS} ns **/
export async function main(ns) {
    const currHost = ns.getHostname();
    if (currHost != "home") {
        ns.tprint(`this script is designed to run in home. `);
        return;
    }
    
    const destHost = ns.args[0];
    const deployScript = "deploy-single-with-max-thread.js";
    const remoteScript =  "increase-faction-reputation.js";

    // first kill all the scripts on the destination host
    const runningScript = "basic-hack.js";
    let scriptKilled = false;
    if (ns.scriptRunning(runningScript, destHost)) {
        scriptKilled = await ns.scriptKill(runningScript, destHost);
    }
    if (scriptKilled)  {
        ns.print(`${runningScript} killed in ${destHost}`);
    }

    await ns.scp(remoteScript, currHost, destHost);
    await ns.exec(deployScript, currHost, 1, destHost, remoteScript);
}