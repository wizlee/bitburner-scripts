/** @param {NS} ns **/
export async function main(ns) {
    const mode = ns.args[0];
    const servers = [
        "n00dles",
        "foodnstuff",
        "sigma-cosmetics",
        "joesguns",
        "nectar-net",
        "hong-fang-tea",
        "harakiri-sushi",
        "neo-net",
        "zer0",
        "max-hardware",
        "iron-gym",
        ];
    while (true) {
        for (var i = 0; i < servers.length; ++i) {
            let target = servers[i];
            if (mode == "hack") {
                await ns.hack(target);
            }
            else {
                const moneyThresh = ns.getServerMaxMoney(target) * 0.75;
                const securityThresh = ns.getServerMinSecurityLevel(target) + 5;
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
}