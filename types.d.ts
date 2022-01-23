export interface ServerData {
    servers: string[];
    scripts: string[];
    txts: string[];
    flags: string[];
}

export interface Route {
    [key: string]: Array<string>;
}

export interface FilesMetadata {
    lastChange: number;
    lastChangeString: string;
    fileList: string[];
}
