/** @param {NS} ns **/
export async function main(ns) {
    while (true) {
        const doc = eval('document');
        const buttons = document.querySelectorAll('button');
        /** @type {HTMLButtonElement} */
        let homicideBtn = null;
        for (let i = 0; i < buttons.length; ++i) {
            if (buttons[i].firstChild.nodeValue === "Homicide (") {
                homicideBtn = buttons[i];
            }
        }

        if (homicideBtn) {
            homicideBtn.click();
            await ns.asleep(3000);
        }
        else {
            await ns.asleep(5000);
        }

    }

}