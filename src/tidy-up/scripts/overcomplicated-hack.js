/** @param {NS} ns **/
export async function main(ns) {
    const targetHost = ns.args[0];
    const script = ns.getScriptName();
    const maxPrepTimeBeforeHackInSec = 300;
    const maxAllowThread = ns.getRunningScript().threads;
    ns.print(`script filename: ${script}`);
    ns.print(`maxAllowThread: ${maxAllowThread}`);
    ns.print("");

    const serverMaxMoney = ns.getServerMaxMoney(targetHost);
    let currMoney = ns.getServerMoneyAvailable(targetHost);
    if (currMoney === 0) currMoney = 1; // to avoid divide by 0
    let numOfThreadToCompGrow = Math.ceil(ns.growthAnalyze(targetHost, serverMaxMoney / currMoney));
    let timeToFinishGrowInSec = numOfThreadToCompGrow * ns.getGrowTime(targetHost) * 1000;
    let moneyThresh = serverMaxMoney * 0.75;
    if (maxPrepTimeBeforeHackInSec < timeToFinishGrowInSec) {
        moneyThresh = (maxAllowThread / numOfThreadToCompGrow) * currMoney;
    }
    ns.print("==================");
    ns.print("Debug Log (Grow)");
    ns.print("==================");
    ns.print(`currMoney/serverMaxMoney: ${currMoney}/${serverMaxMoney};`);
    ns.print(`numOfThreadToCompGrow: ${numOfThreadToCompGrow};`);
    ns.print(`timeToFinishGrowInSec: ${timeToFinishGrowInSec};`);
    ns.print(`moneyThresh: ${moneyThresh};`);
    ns.print("");
    ns.print("");

    const minSec = ns.getServerMinSecurityLevel(targetHost);
    let currSec = ns.getServerSecurityLevel(targetHost);
    let numOfThreadToCompWeaken = Math.ceil((currSec - minSec) * 20)
    let timeToFinishWeakenInSec = numOfThreadToCompWeaken * ns.getWeakenTime(targetHost) * 1000;
    let securityThresh = minSec + 10;
    if (maxPrepTimeBeforeHackInSec < timeToFinishWeakenInSec) {
        securityThresh = (numOfThreadToCompWeaken / maxAllowThread) * currSec;
    }
    ns.print("==================");
    ns.print("Debug Log (Weaken)");
    ns.print("==================");
    ns.print(`currSec/minSec: ${currSec}/${minSec};`);
    ns.print(`numOfThreadToCompWeaken: ${numOfThreadToCompWeaken};`);
    ns.print(`timeToFinishWeakenInSec: ${timeToFinishWeakenInSec};`);
    ns.print(`securityThresh: ${securityThresh};`);
    ns.print("");
    ns.print("");

    while(true) {
        if (ns.getServerSecurityLevel(targetHost) > securityThresh) {
            await ns.weaken(targetHost);
        } else if (ns.getServerMoneyAvailable(targetHost) < moneyThresh) {
            await ns.grow(targetHost);
        } else {
            await ns.hack(targetHost);
        }

        // reevaluate
        currMoney = ns.getServerMoneyAvailable(targetHost);
        if (currMoney === 0) currMoney = 1; // to avoid divide by 0
        numOfThreadToCompGrow = Math.ceil(ns.growthAnalyze(targetHost, serverMaxMoney / currMoney));
        timeToFinishGrowInSec = numOfThreadToCompGrow * ns.getGrowTime(targetHost) * 1000;
        moneyThresh = serverMaxMoney * 0.75;
        if (maxPrepTimeBeforeHackInSec < timeToFinishGrowInSec) {
            moneyThresh = (maxAllowThread / numOfThreadToCompGrow) * currMoney;
        }

        currSec = ns.getServerSecurityLevel(targetHost);
        numOfThreadToCompWeaken = Math.ceil((currSec - minSec) * 20)
        timeToFinishWeakenInSec = numOfThreadToCompWeaken * ns.getWeakenTime(targetHost) * 1000;
        securityThresh = minSec + 10;
        if (maxPrepTimeBeforeHackInSec < timeToFinishWeakenInSec) {
            securityThresh = (numOfThreadToCompWeaken / maxAllowThread) * currSec;
        }
    }
}