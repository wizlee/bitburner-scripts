let CNT = 8;

/** @param {NS} ns **/
function myMoney(ns) {
    return ns.getServerMoneyAvailable("home");
}

/** @param {NS} ns **/
async function keepBuyingNodesTillCnt(ns) {
    while(ns.hacknet.numNodes() < CNT) {
        let cost = ns.hacknet.getPurchaseNodeCost();
        while (myMoney(ns) < cost) {
            ns.print("Need $" + cost + " . Have $" + myMoney(ns));
            await ns.sleep(3000);
        }
        let idx = ns.hacknet.purchaseNode();
        ns.print("Purchased hacknet Node with index " + idx);
    };
}

/** @param {NS} ns **/
async function upgradeAllNodesToLvl(ns, lvl) {
    for (let i = 0; i < CNT; i++) {
        while (ns.hacknet.getNodeStats(i).level < lvl) {
            let cost = ns.hacknet.getLevelUpgradeCost(i, 10);
            if (cost >= Infinity) {
                await ns.sleep(200); // prevent script from running too 'hot'
                continue;
            }
            while (myMoney(ns) < cost) {
                ns.print("Need $" + cost + " . Have $" + myMoney(ns));
                await ns.sleep(3000);
            }
            ns.hacknet.upgradeLevel(i, 10);
        };
    };
    ns.print(`All ${CNT} nodes are now at level ${lvl}`);
}

/** @param {NS} ns **/
async function maxOutRamForAllNodes(ns) {
    for (let i = 0; i < CNT; i++) {
        while (ns.hacknet.getNodeStats(i).ram < 64) {
            let cost = ns.hacknet.getRamUpgradeCost(i, 2);
            if (cost >= Infinity) {
                await ns.sleep(200); // prevent script from running too 'hot'
                continue;
            }
            while (myMoney(ns) < cost) {
                ns.print("Need $" + cost + " . Have $" + myMoney(ns));
                await ns.sleep(3000);
            }
            ns.hacknet.upgradeRam(i, 2);
        };
    };
    ns.print(`All ${CNT} nodes upgraded to 64GB RAM`);
}

/** @param {NS} ns **/
async function increaseNumOfCpuAllNodes(ns, cpu) {
    for (let i = 0; i < CNT; i++) {
        while (ns.hacknet.getNodeStats(i).cores < cpu) {
            let cost = ns.hacknet.getCoreUpgradeCost(i, 1);
            if (cost >= Infinity) {
                await ns.sleep(200); // prevent script from running too 'hot'
                continue;
            }
            while (myMoney(ns) < cost) {
                ns.print("Need $" + cost + " . Have $" + myMoney(ns));
                await ns.sleep(3000);
            }
            ns.hacknet.upgradeCore(i, 1);
        };
    };
    ns.print(`All ${CNT} nodes upgraded to ${cpu} cores`);
}


/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("getServerMoneyAvailable");
    ns.disableLog("sleep");

    await keepBuyingNodesTillCnt(ns);

    ns.print("==============================");
    ns.print("Upgrading nodes to level 131");
    ns.print("==============================");
    await upgradeAllNodesToLvl(ns, 131);

    ns.print("==============================");
    ns.print("Buying more 6 more nodes and upgrade all to level 151");
    ns.print("==============================");
    CNT = 14;
    await keepBuyingNodesTillCnt(ns);
    await upgradeAllNodesToLvl(ns, 151);

    ns.print("==============================");
    ns.print("Max out RAM of all nodes");
    ns.print("==============================");
    await maxOutRamForAllNodes(ns);

    ns.print("==============================");
    ns.print("Upgrade all nodes to 8 cores");
    ns.print("==============================");
    await increaseNumOfCpuAllNodes(ns, 8);
    
    ns.print("==============================");
    ns.print("Buy 2 more nodes and max out level for all nodes");
    ns.print("==============================");
    CNT = 18;
    await keepBuyingNodesTillCnt(ns);
    await upgradeAllNodesToLvl(ns, 200);
    await maxOutRamForAllNodes(ns);
    await increaseNumOfCpuAllNodes(ns, 8);
}