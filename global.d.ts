// Put any global definitions here
import * as bitburner from "@ns";
import * as types from "@types";

export {};

declare global {
    interface NS extends bitburner.NS {}
    interface ServerData extends types.ServerData {}
    interface Route extends types.Route {}
    interface FilesMetadata extends types.FilesMetadata {}
}
