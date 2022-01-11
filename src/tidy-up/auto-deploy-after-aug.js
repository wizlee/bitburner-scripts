/** @param {NS} ns **/
export async function main(ns) {
	const hackScript = ns.args[0]; // basic-hack.js, hack-or-grow-all-early-servers.js etc
	const deployScript = "deploy-single-with-max-thread.js";
	const currHost = ns.getHostname();
	// Array of all servers that don't need any ports opened
	// to gain root access. 
	var servers0Port = ["n00dles",
						"foodnstuff",
						"sigma-cosmetics",
						"joesguns",
						"nectar-net",
						"hong-fang-tea",
						"harakiri-sushi"];

	// Array of all servers that only need 1 port opened
	// to gain root access. 
	var servers1Port = ["neo-net",
						"zer0",
						"max-hardware",
						"iron-gym"];

	// Copy our scripts onto each server that requires 0 ports
	// to gain root access. Then use nuke() to gain admin access and
	// run the scripts.
	for (var i = 0; i < servers0Port.length; ++i) {
		var serv = servers0Port[i];

		await ns.scp(hackScript, serv);
		await ns.nuke(serv);
		// await ns.exec(deployScript, currHost, 1, serv, hackScript, serv);
		await ns.exec(deployScript, currHost, 1, serv, hackScript, "joesguns");
	}

	// Wait until we acquire the "BruteSSH.exe" program
	while (!ns.fileExists("BruteSSH.exe")) {
		await ns.sleep(60000);
	}

	// Copy our scripts onto each server that requires 1 port
	// to gain root access. Then use brutessh() and nuke()
	// to gain admin access and run the scripts.
	for (var i = 0; i < servers1Port.length; ++i) {
		var serv = servers1Port[i];

		await ns.scp(hackScript, serv);
		await ns.brutessh(serv);
		await ns.nuke(serv);
		// await ns.exec(deployScript, currHost, 1, serv, hackScript, serv);
		await ns.exec(deployScript, currHost, 1, serv, hackScript, "joesguns");
	}

	// special 1 port server that don't have money
	// hardcode to not hack itselfs
	const CSEC = "CSEC";
	await ns.scp(hackScript, CSEC);
	await ns.brutessh(CSEC);
	await ns.nuke(CSEC);
	await ns.exec(deployScript, currHost, 1, CSEC, hackScript, "joesguns");
}