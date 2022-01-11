/** @param {NS} ns **/
export async function main(ns) {
    const target = ns.args[0];
    const mode = ns.args[1];
    let moneyThresh = 0;
    let securityThresh = 0;

    while(true) {
        if (mode == "hack") {
            await ns.hack(target);
        }
        else {
            moneyThresh = ns.getServerMaxMoney(target) * 0.75;
            securityThresh = ns.getServerMinSecurityLevel(target) + 5;
            if (ns.getServerSecurityLevel(target) > securityThresh) {
                await ns.weaken(target);
            } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
                await ns.grow(target);
            } else {
                await ns.hack(target);
            }
        }
    }
}