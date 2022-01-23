const port = process.env.PORT || 8000;

import express from "express";
import cors from "cors";
import glob from "glob";
import fs from "fs";

try {
    express()
        .use(cors())
        .get("/index.json", async (req, res) => {
            glob("dist/**/*.js", (err, result) => {
                const modifiedDates = result.map((x) =>
                    new Date(fs.statSync(x).mtime).getTime()
                );
                const lastChange = Math.max(...modifiedDates);
                res.json({
                    lastChange: lastChange,
                    lastChangeString: new Date(lastChange),
                    fileList: result.map((x) => x.replace("dist/", "")),
                });
            });
        })
        .use(express.static("dist/")) // serve all files in dist/ on the root path
        .use("/sources/", express.static("src/"))
        .listen(port);
    console.log(`> Read on http://localhost:${port}`);
} catch (e) {
    if (e instanceof Error) {
        console.error(e.message);
        console.error(e.stack);
    }
    else {
        console.error("unknown error.");
    }
    process.exit(1);
}
