import { Util } from "/helpers/util";
import { SetAlias } from "/helpers/set-alias";
import { HOME } from "/helpers/const";

const Sync = "sync.js";
const Watcher = "watcher.js";
const Test = "test.js";

export async function main(ns: NS): Promise<void> {
    ns.disableLog("ALL");
    const util = await Util.getInstance(ns);

    if (!ns.isRunning(Watcher, HOME)) {
        ns.tprint(`[${util.localeHHMMSS()}] Starting watcher...`);
        await ns.exec(Watcher, HOME);
    }

    ns.tprint(`[${util.localeHHMMSS()}] Setting aliases...`);
    const setAlias = await SetAlias.getInstance(ns);
    setAlias.all();
    setAlias.scriptCmd("init", `run ${ns.getScriptName()}`);
    setAlias.scriptCmd("sync", `run ${Sync}`);
    setAlias.scriptCmd("watch", `run ${Watcher}`);
    setAlias.scriptCmd("test", `run ${Test}`);
}
