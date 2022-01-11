/** @param {NS} ns **/
export async function main(ns) {
    const serverList = [
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
        "CSEC",
        "silver-helix",
        "phantasy",
        "omega-net",
        "avmnite-02h",
        "johnson-ortho",
        "crush-fitness",
        "the-hub"
    ];
    serverList.forEach(hostname => {
        const files = ns.ls(hostname)
        if (files && files.length) {
            const contract = files.find((file) => file.includes('.cct'))

            if (!!contract) {
            ns.tprint('')
            ns.tprint(`* ${hostname} has a coding contract(s)! Connect using:`)
            // ns.tprint(printPathToServer(serverMap.servers, hostname) + `; run ${contract};`)
            }
        }
    });
}