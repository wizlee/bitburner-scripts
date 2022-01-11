let CNT = 16;

/** @param {NS} ns **/
function myMoney(ns) {
    return ns.getServerMoneyAvailable("home");
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

    if (ns.hacknet.numNodes() < CNT) {
        ns.print(`Num of nodes less than ${CNT}, run buy-hacknet-nodes.js first`);
        return;
    }

    CNT = ns.hacknet.numNodes();
    let targetNumOfNodes = 30
    ns.print("==============================");
    ns.print(`Buying up until ${targetNumOfNodes} hacknet nodes`);
    ns.print("==============================");
    while(ns.hacknet.numNodes() < targetNumOfNodes) {
        let buyCost = ns.hacknet.getPurchaseNodeCost();
        let addCoreCost = ns.hacknet.getCoreUpgradeCost(0, 1);
        const numOfCores = ns.hacknet.getNodeStats(0).cores;

        if (buyCost + 41000000 < addCoreCost) {
            while (myMoney(ns) < buyCost) {
                ns.print("Need $" + buyCost + " . Have $" + myMoney(ns));
                await ns.sleep(3000);
            }
            let idx = ns.hacknet.purchaseNode();
            ns.print("Purchased hacknet Node with index " + idx);
            CNT = idx + 1;
            await upgradeAllNodesToLvl(ns, 200);
            await maxOutRamForAllNodes(ns);
            await increaseNumOfCpuAllNodes(ns, numOfCores);
        }
        else {
            await increaseNumOfCpuAllNodes(ns, numOfCores + 1);
        }
    };
}