// source: https://www.html-code-generator.com/javascript/shorten-long-numbers
function intToString(num) {
    num = num.toString().replace(/[^0-9.]/g, '');
    if (num < 1000) {
        return num;
    }
    let si = [
      {v: 1E3, s: "K"},
      {v: 1E6, s: "M"},
      {v: 1E9, s: "B"},
      {v: 1E12, s: "T"},
      {v: 1E15, s: "P"},
      {v: 1E18, s: "E"}
      ];
    let index;
    for (index = si.length - 1; index > 0; index--) {
        if (num >= si[index].v) {
            break;
        }
    }
    return (num / si[index].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[index].s;
}

/** @param {NS} ns **/
function printServerCost(ns) {
    ns.tail();
    const maxServerRam = ns.getPurchasedServerMaxRam();
    const maxServerCost = ns.getPurchasedServerCost(maxServerRam);
    ns.print(`======================================`);
    ns.print(`Server Cost Info`);
    ns.print(`======================================`);
    ns.print(`maxServerRam: ${maxServerRam} GB`);
    ns.print(`maxServerCost: ${intToString(maxServerCost)}`);

    const base = 2;
    let serverCost = [];
    for (let i = 0; i < 21; ++i) {
        serverCost.push(ns.getPurchasedServerCost(Math.pow(base, i)));
    }

    serverCost.forEach((cost, index) => {
        ns.print(`${Math.pow(base, index)} GB ServerCost: ${intToString(cost)}`);
    });
    ns.print(`======================================`);
    ns.print(``);
    ns.print(``);
}

/** @param {NS} ns **/
async function purchaseServerUntilLimit(ns) {
    ns.print(`======================================`);
    ns.print(`Buying Server with max RAM until limit`);
    ns.print(`======================================`);
    const currHost = ns.getHostname();
    if (currHost != "home") {
        ns.print(`this script is designed to run in home. `);
        return;
    }
    // const ram = ns.getPurchasedServerMaxRam(); // 2^20 as of 16/01/2022
    const ram = 131072;
    let i = ns.getPurchasedServers().length;
	const deployScript = "simple-distributed-hack.js";
    const hackScript =  "basic-hack.js";
	// anything significantly less than 1000 will cause the game to crash / hang
    // presumably because of the huge number of running scripts.
    // Example:
    // if threadnum=100, you will have 25 * (2^20 / 240) ~= 109,226 scripts running at once.
    // This is excluding scripts running on home and non player own servers.
    // At the time of the hang, I have ~109,226 + ~3,000 = ~112,226 scripts running.
    const threadNum = 300;

    const maxServerNum = ns.getPurchasedServerLimit();
    while (i < maxServerNum) {
        let moneyAvail = ns.getServerMoneyAvailable(currHost);
        let purchasedServerCost = ns.getPurchasedServerCost(ram);
        // Check if we have enough money to purchase a server
        if (moneyAvail > purchasedServerCost) {
            // If we have enough money, then:
            //  1. Purchase the server
            //  2. Deploy hacking script to the server using max thread possible
            //  3. Increment our iterator to indicate that we've bought a new server
            let destHost = await ns.purchaseServer(`${currHost}-${i}`, ram);
            ns.tprint(`>>>>>> Purchased Server: ${destHost}`);
            await ns.scp(hackScript, currHost, destHost);
            await ns.exec(deployScript, currHost, 1, destHost, threadNum);
            i++;
            await ns.sleep(4000); // to avoid wasting time on hacking empty n00dles
        }
        else {
            ns.print(`moneyAvail: ${moneyAvail}`);
            ns.print(`purchaseServerCost: ${purchasedServerCost}`);
            await ns.sleep(10000);
        }
    }
    ns.print(`======================================`);
    ns.print(``);
    ns.print(``);
}

/** @param {NS} ns **/
/** use this to purchase and run hack script for server with less than 10TB **/
async function earlyGamePurchaseServerUntilLimit(ns) {
    ns.print(`======================================`);
    ns.print(`Buying Server until limit`);
    ns.print(`======================================`);
    const currHost = ns.getHostname();
    if (currHost != "home") {
        ns.print(`this script is designed to run in home. `);
        return;
    }
    if (ns.args.length < 1) {
		ns.tprint("This script perform 3 functions: display server cost, purchase servers until limit and delete all servers.");
		ns.tprint("");
		ns.tprint("Currently you are performing purchase server until limit. ");

		ns.tprint(`Pass the required args: run ${ns.getScriptName()} RAM HACKTARGET(s)`);
		ns.tprint("Example:");
		ns.tprint(`> run ${ns.getScriptName()} 512 n00dles max-hardware`);
	}
    const ram = Number.parseInt(ns.args[0]); // 512
    let i = ns.getPurchasedServers().length;
	const deployScript = "deploy-single-with-max-thread.js";
    const hackScript =  "basic-hack.js";
	const hackTargets = ns.args.slice(1);
    let currTarget = hackTargets[0];

    const maxServerNum = ns.getPurchasedServerLimit();
    while (i < maxServerNum) {
        let moneyAvail = ns.getServerMoneyAvailable(currHost);
        let purchasedServerCost = ns.getPurchasedServerCost(ram);
        // Check if we have enough money to purchase a server
        if (moneyAvail > purchasedServerCost) {
            // If we have enough money, then:
            //  1. Purchase the server
            //  2. Deploy hacking script to the server using max thread possible
            //  3. Increment our iterator to indicate that we've bought a new server
            let destHost = await ns.purchaseServer(`${currHost}-${i}`, ram);
            ns.print(`>>>>>> Purchased Server: ${destHost}`);
            await ns.scp(hackScript, currHost, destHost);

            // hack the list of target in sequence
            if (hackTargets.length > 1) {
                currTarget = hackTargets.join(',');
                // if (ram > 1000) {
                //     currTarget = hackTargets.join(',');
                // }
                // else {
                //     currTarget = hackTargets[i % hackTargets.length];
                // }
            }
            await ns.exec(deployScript, currHost, 1, destHost, hackScript, currTarget);
            i++;
            await ns.sleep(4000); // to avoid wasting time on hacking empty n00dles
        }
        else {
            ns.print(`moneyAvail: ${moneyAvail}`);
            ns.print(`purchaseServerCost: ${purchasedServerCost}`);
            await ns.sleep(10000);
        }
    }
    ns.print(`======================================`);
    ns.print(``);
    ns.print(``);
}

/** @param {NS} ns **/
async function deleteAllServer(ns) {
    ns.print(`======================================`);
    ns.print(`Deleting All Purchased Servers`);
    ns.print(`======================================`);
    const runningScript = "basic-hack.js";
    let purchasedServerList = ns.getPurchasedServers();
    for (let i = 0; i < purchasedServerList.length; i++) {
        const serverName = purchasedServerList[i];
        let scriptKilled = false;
        if (ns.scriptRunning(runningScript, serverName)) {
            scriptKilled = await ns.scriptKill(runningScript, serverName);
        }
        if (scriptKilled)  {
            ns.print(`${runningScript} killed in ${serverName}`);
        }
        if (await ns.deleteServer(serverName)) {
            ns.print(`>>>>> ${serverName} deleted`);
        }
    }

    // this foreach loop will cause Runtime exception even though it should work
    // purchasedServerList.forEach((serverName) => {
    //     let scriptKilled = false;
    //     if (ns.scriptRunning(runningScript, serverName)) {
    //         scriptKilled = await ns.scriptKill(runningScript, serverName);
    //     }
    //     if (scriptKilled)  {
    //         ns.print(`${runningScript} killed in ${serverName}`);
    //     }
    //     if (await ns.deleteServer(serverName)) {
    //         ns.print(`>>>>> ${serverName} deleted`);
    //     }
    // });
    ns.print(`======================================`);
    ns.print(``);
    ns.print(``);
}

/** @param {NS} ns **/
export async function main(ns) {
    // printServerCost(ns);
    await deleteAllServer(ns);
    // await earlyGamePurchaseServerUntilLimit(ns);
    await purchaseServerUntilLimit(ns);
}