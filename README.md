## Overview
- [This repo](https://github.com/wizlee/bitburner-scripts) is adapted from [this template](https://github.com/bitburner-official/vscode-template), 

## Extension Recommendations
[vscode-bitburner-connector](https://github.com/bitburner-official/bitburner-vscode) ([vscode extension marketplace](https://marketplace.visualstudio.com/items?itemName=bitburner.bitburner-vscode-integration)) to upload your files into the game
   - this seems to only valid for steam, when playing bitburner in browser don't observe any feature this extension provides

[vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) to use live linting in editor

[auto-snippet](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.auto-snippet) to automate inserting the file template in `.vscode/snippets.code-snippets`

There is a workspace file in `.vscode` which contains the recommended settings for all of these

## Dependencies
[Node.js](https://nodejs.org/en/download/) required for compiling typescript and installing dependencies

## Installation
```
git clone https://github.com/wizlee/bitburner-scripts.git
npm install
npm run defs
```

## How to use this
Write all your typescript source code in the `/src` directory

Ensure you are using absolute paths to .js files in your imports or else the game will not recognize your import paths.  
Example: use `import {} from '/lib/helpers.js'` instead of `import {} from './lib/helpers'` 

To autocompile as you save, run `npm run watch` in a terminal

To update your Netscript Definitions, run `npm run defs` in a terminal

Press F1 and Select `Bitburner: Enable File Watcher` to enable auto uploading to the game

If you run `watcher.js` in game, the game will automatically detect file changes and restart the associated scripts

## NS2 Script Guide
Excerpt from [this official documentation](https://github.com/danielyxie/bitburner/blob/dev/doc/source/netscript/netscriptjs.rst).

The following ns functions return a promise thus expects a `await`
    hack
    grow
    weaken
    sleep
    prompt
    wget
    scp
    write
    writePort

## Debugging

For debugging bitburner on Steam you will need to enable a remote debugging port. This can be done by rightclicking bitburner in your Steam library and selecting properties. There you need to add `--remote-debugging-port=9222` [Thanks @DarkMio]
  - refer to [@DarkMio repo](https://github.com/DarkMio/bitburner-ts) for detailed intructions. 

When debugging you see errors like the following:

```
Could not read source map for file:///path/to/Steam/steamapps/common/Bitburner/resources/app/dist/ext/monaco-editor/min/vs/editor/editor.main.js: ENOENT: no such file or directory, open '/path/to/Steam/steamapps/common/Bitburner/resources/app/dist/ext/monaco-editor/min/vs/editor/editor.main.js.map'
```

These errors are to be expected, they are referring to the game's files and the game does not come packaged with sourcemaps.
