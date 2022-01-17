/** @param {NS} ns **/
export async function main(ns) {
    if (ns.args.length < 2) {
        ns.tprint(`Pass the required args: run ${ns.getScriptName()} HOST THREAD_COUNT`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()} home 100`);
        return;
    }

    const host = ns.args[0];
    const threadCnt = Number.parseInt(ns.args[1]);
    let currRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
    // removes this if condition check to allow script to
    // 'resume' running when back online
    if (currRam < 10000) {
        ns.tprint(`this script is designed to run in server that has more than 10TB. `);
        return;
    }

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
        "silver-helix",
        "phantasy",
        "omega-net",
        "johnson-ortho",
        "crush-fitness",
        "the-hub",
        "catalyst",
        "comptek",
        "rothman-uni",
        "summit-uni",
        "netlink",
        "millenium-fitness",
        "rho-construction",
        "aevum-police",
        "alpha-ent",
        "syscore",
        "lexo-corp",
        "snap-fitness",
        "global-pharm",
        "nova-med",
        "univ-energy",
        "unitalife",
        "zb-def",
        "zb-institute",
        "omnia",
        "zeus-med",
        "infocomm",
        "deltaone",
        "icarus",
        "aerocorp",
        "galactic-cyber",
        "defcomm",
        "taiyang-digital",
        "solaris",
    ];
    const hackScript = "basic-hack.js";
    const scriptRam = ns.getScriptRam(ns.getScriptName());
    // const bufferRam = 32;
    const totalScriptRam = scriptRam * threadCnt;
    const scriptDelayInterval = 4000/servers.length;
    const estScriptRunTime = (currRam/totalScriptRam) * scriptDelayInterval;
    ns.tprint(`>>>> This script will complete in approx. ${estScriptRunTime/1000} seconds`);

    let n = 0;
    let arg = [`${servers[0]}`, ""];
    let isRunning = false;
    let scriptNum = 0;
    const dummyArgBase = "dummyarg";
    while (isRunning = ns.isRunning(hackScript, host, ...arg)) {
        ++scriptNum;
        arg.pop();
        arg.push(`${dummyArgBase}${scriptNum}`);
    }
    n = scriptNum > 1 ? scriptNum : n;

    while (currRam > totalScriptRam) {
        for (let i = 0; i < servers.length; ++i) {
            const target = servers[i];
            let dummyArg = n ?  `${dummyArgBase}${n}` : "";
            await ns.exec(hackScript, host, threadCnt, target, dummyArg);

            // this isa crude attempt to put more weight to hack servers
            // with higher difficulty
            const serverDifficulty = Math.round(i/10);
            if (serverDifficulty > 1) {
                for (let j = 0; j < serverDifficulty; ++j) {
                    ++n;
                    // arbitrary delay to avoid wasting time on hacking empty n00dles
                    await ns.sleep(Math.round(scriptDelayInterval));
                    dummyArg = `${dummyArgBase}${n}`;
                    await ns.exec(hackScript, host, threadCnt, target, dummyArg);
                }
            }
            // arbitrary delay to avoid wasting time on hacking empty n00dles
            await ns.sleep(Math.round(scriptDelayInterval));
        }
        ++n;
        currRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
    }
}
