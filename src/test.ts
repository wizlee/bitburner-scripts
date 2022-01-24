import { Util } from '/helpers/util';

export async function main(ns : NS) : Promise<void> {
    const util = await Util.getInstance(ns);
    util.listSpecialServers();
    util.printContractsLocation();
}
