const HOME = "home";
const FileList = "index.txt";
const Init = "init.js";

export async function main(ns : NS) : Promise<void> {
    ns.disableLog("ALL");

    ns.tprint("");
    ns.tprint("==========================================================");
    ns.tprint("Polling for files updates...");
    ns.tprint("==========================================================");
    let lastChange = new Date(0);

    while (true) {
        const success = await ns.wget(
            "http://localhost:8000/index.json",
            FileList,
            HOME
        );
        if (!success) {
            await ns.sleep(10_000);
            continue;
        }
        const updateList = JSON.parse(`${ns.read(FileList)}`) as FilesMetadata;
        const updateDate = new Date(updateList.lastChange);
        if (updateDate <= lastChange) {
            await ns.sleep(5_000);
            continue;
        }

        lastChange = updateDate;
        ns.rm(FileList, HOME);
        ns.tprint(
            `>>> Downloading [${updateList.fileList.length}] source files`
        );

        for (const idx in updateList.fileList) {
            const file = updateList.fileList[idx];
            const location = file.includes("/") ? `/${file}` : file; // special handling for directories
            await ns.wget(`http://localhost:8000/${file}`, location, HOME);
            // avoid choking the browser and/or server
            await ns.sleep(100);
        }

        if (!ns.isRunning(Init, HOME)) {
            ns.tprint(">>> Starting init script...");
            await ns.exec(Init, HOME);
        }

        ns.tprint("# Self updating complete");
        await ns.sleep(10_000);
    }

}
