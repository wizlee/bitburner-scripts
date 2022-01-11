/** @param {NS} ns **/
// example: run deploy-single-with-max-thread.js n00dles hack-get-money-fast.js n00dles
export async function main(ns) {
	const args = ns.flags([["help", false]]);
	if (args.help || args._.length < 2) {
		ns.tprint("This script deploys another script on a server with maximum threads possible.");
		ns.tprint(`Usage: run ${ns.getScriptName()} HOST SCRIPT ARGUMENTS`);
		ns.tprint("Example:");
		ns.tprint(`> run ${ns.getScriptName()} n00dles hack-get-money-fast.js n00dles`);
		return;
	}

	const host = args._[0];
	let targets = [];
	const script = args._[1];
	const script_args = args._.slice(2);

	if (script_args.length == 1 && script_args[0].includes(',')) {
		targets.push(...script_args[0].split(','));
	}

	if (!ns.serverExists(host)) {
		ns.tprint(`Server '${host}' does not exist. Aborting.`);
		return;
	}
	if (!ns.ls(ns.getHostname()).find(f => f === script)) {
		ns.tprint(`Script '${script}' does not exist. Aborting.`);
		return;
	}

	if (targets.length > 0) {
		const threads = Math.floor((ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / ns.getScriptRam(script) / targets.length);
		for (let i = 0; i < targets.length; ++i) {
			ns.tprint(`Launching script '${script}' on server '${host}' with ${threads} threads and the following arguments: ${targets[i]}`);
			await ns.scp(script, ns.getHostname(), host);
			ns.exec(script, host, threads, targets[i]);
		}
	}
	else {
		const threads = Math.floor((ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / ns.getScriptRam(script));
			ns.tprint(`Launching script '${script}' on server '${host}' with ${threads} threads and the following arguments: ${script_args}`);
			await ns.scp(script, ns.getHostname(), host);
			ns.exec(script, host, threads, ...script_args);
	}
}