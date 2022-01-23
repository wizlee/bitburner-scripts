import { Util } from "./util";

export class SetAlias {
    private static instance?: SetAlias;
    private ns: NS;
    private util: Util;

    private constructor(ns: NS, util: Util) {
        if (SetAlias.instance)
            throw new Error("Use Singleton.getInstance instead of new.");
        this.ns = ns;
        this.util = util;
    }

    static async getInstance(ns: NS): Promise<SetAlias> {
        if (!SetAlias.instance) {
            SetAlias.instance = new SetAlias(ns, await Util.getInstance(ns));
        }

        return SetAlias.instance;
    }

    all(): void {
        this.buyCmd();
        this.hackCmd();
    }

    scriptCmd(aliasName: string, aliasCmd: string): void {
        this.util.terminalCommand(`alias -g ${aliasName}="${aliasCmd}"`);
    }

    /**
     * @description
     * Set aliases for the following commands:
     * nuke, ssh, ftp, smtp, http, sql
     */
    hackCmd(): void {
        this.util.terminalCommand(
            `alias -g nuke="run NUKE.exe"; alias -g ssh="run BruteSSH.exe"; alias -g ftp="run FTPCrack.exe"; alias -g smtp="run relaySMTP.exe"; alias -g http="run HTTPWorm.exe"; alias -g sql="run SQLInject.exe"`
        );
    }

    /**
     * @description
     * Set aliases for the following commands:
     * `buySsh`, `buyFtp`, `buySmtp`, `buyHttp`, `buySql` and `buyAll`
     */
    buyCmd(): void {
        this.util.terminalCommand(
            `alias -g buySsh="connect darkweb; buy BruteSSH.exe; home"; alias -g buyFtp="connect darkweb; buy FtpCrack.exe; home"; buySsh="connect darkweb; buy BruteSSH.exe; home"; alias -g buySql="connect darkweb; buy SQLInject.exe; home"; alias -g buyHttp="connect darkweb; buy HTTPWorm.exe; home"; alias -g buySmtp="connect darkweb; buy relaySMTP.exe; home"; alias -g buyAll="connect darkweb; buy BruteSSH.exe; buy FtpCrack.exe; buy SQLInject.exe; buy HTTPWorm.exe; buy relaySMTP.exe; home"`
        );
    }
}
