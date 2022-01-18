export interface ServerData {
    servers: string[];
    scripts: string[];
    txts: string[];
    flags: string[];
}

export interface Route {
    [key: string]: Array<string>;
}
