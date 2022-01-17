import { NS } from '@ns'
import { terminalCommand } from "util";

export async function main(ns : NS) : Promise<void> {
  // set all alias
  terminalCommand(
      `alias vsc="run ${ns.getScriptName()}" alias nuke="run NUKE.exe"; alias ssh="run BruteSSH.exe"; alias ftp="run FTPCrack.exe"; alias server="run ServerProfiler.exe"; alias smtp="run relaySMTP.exe"; alias http="run HTTPWorm.exe"; alias sql="run SQLInject.exe"`
  );
}
