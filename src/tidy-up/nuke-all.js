/** @param {NS} ns **/
export async function main(ns) {
    const serversNoPorts = [
        "n00dles",
        "foodnstuff",
        "sigma-cosmetics",
        "joesguns",
        "nectar-net",
        "hong-fang-tea",
        "harakiri-sushi",
    ];
    const servers1Ports = [
        "neo-net",
        "zer0",
        "max-hardware",
        "iron-gym",
        "CSEC",
    ];
    const servers2Ports = [
        "silver-helix",
        "phantasy",
        "omega-net",
        "avmnite-02h",
        "johnson-ortho",
        "crush-fitness",
        "the-hub",
    ];
    const servers3Ports = [
        "catalyst",
        "comptek",
        "rothman-uni",
        "summit-uni",
        "netlink",
        "I.I.I.I",
        "millenium-fitness",
        "rho-construction",
    ];
    const servers4Ports = [
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
    ];
    const servers5Ports = [
        "darkweb",
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

    const allServers = [
        serversNoPorts,
        servers1Ports,
        servers2Ports,
        servers3Ports,
        servers4Ports,
        servers5Ports
    ];

    const hackTools = [
        "BruteSSH.exe",
        "FTPCrack.exe",
        "HTTPWorm.exe",
        "SQLInject.exe",
        "relaySMTP.exe",
    ]

    const hacksToolsFn = {
        "BruteSSH.exe": ns.brutessh,
        "FTPCrack.exe": ns.ftpcrack,
        "HTTPWorm.exe": ns.httpworm,
        "SQLInject.exe": ns.sqlinject,
        "relaySMTP.exe": ns.relaysmtp,
    };

    const availableHackTools = [];
    hackTools.forEach((exe) => {
        if (ns.fileExists(exe)) {
            availableHackTools.push(hacksToolsFn[exe]);
        }
    });

    const hackableServers = [];
    for (let i = 0; i <= availableHackTools.length; ++i) {
        hackableServers.push(...allServers[i]);
    }

    // bug? can't use await in foreach
    // hackableServers.forEach((server) => {
    //     availableHackTools.forEach((hackFn) => {
    //         await hackFn(server);
    //     });
    //     await ns.nuke(server);
    // })
    for (let i = 0; i < hackableServers.length; ++i){
        const server = hackableServers[i];
        for (let j = 0; j < availableHackTools.length; ++j){
            await availableHackTools[j](server);
        }
        await ns.nuke(server);
    }
}