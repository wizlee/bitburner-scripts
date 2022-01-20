/** @param {NS} ns **/
export async function main(ns) {
    while (true) {
        await ns.share();
        ns.asleep(500);
    }
}