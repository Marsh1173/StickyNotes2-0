const {app, BrowserWindow, ipcMain, webContents} = require('electron')
const fs = require('fs')

var savedWindowsJson = [];
var myWindows = [];

app.on('ready', () => {
    let json = require('./windowStorage.json');

    if (json.length == 0) {
        makeNewWindow();
    } else {
        for (let i = 0; i < json.length; i++) {
            tempWindow = new BrowserWindow({
                frame:false,
                transparent:true,
                backgroundColor:"#00ffffff",
                minWidth: 250,
                minHeight: 100,
                acceptFirstMouse: true,
                
                width:json[i]["size"]["width"],
                height:json[i]["size"]["height"],
                x:json[i]["position"]["x"],
                y:json[i]["position"]["y"],
                webPreferences: {
                    nodeIntegration: true,
                    additionalArguments: [json[i]["text"],],
                },
            })
            tempWindow.loadFile('noteIndex.html');
            myWindows.push(tempWindow);
        }
    }
});

function makeNewWindow() { // make new blank window
    let tempWindow = new BrowserWindow({
        frame:false,
        transparent:true,
        backgroundColor:"#00ffffff",
        minWidth: 250,
        minHeight: 100,
        acceptFirstMouse: true,
        
        width: 600,
        height: 300,
        webPreferences: {
            nodeIntegration: true,
            additionalArguments: ["New note"],
        },
    })
    tempWindow.loadFile('noteIndex.html');
    myWindows.push(tempWindow);
}

ipcMain.on('rendererMessage', (event, arg) => {
    switch (arg[0]) {
        case "minimize" :
            BrowserWindow.fromId(event.sender.id).minimize();
            break;
        case "delete" : // "deleting" doesn't save the info, as opposed to "closing"
            BrowserWindow.fromId(event.sender.id).destroy();
            break;
        case "closing" :
            savedWindowsJson.push({// this is the info for the window
                "text": arg[1]["text"],
                "position": {
                    "x": arg[1]["screenX"],
                    "y": arg[1]["screenY"],
                },
                "size": {
                    "width": arg[1]["width"],
                    "height": arg[1]["height"],
                }
            })
            break;
        case "new" :
            makeNewWindow();
            break;
        default:
            throw new Error("Unrecognized renderer command")
    }
});

app.on('will-quit', () => { // called before the whole application closes
    app.quit()
    const jsonString = JSON.stringify(savedWindowsJson); // json-ifies the global variable
    fs.writeFileSync('./windowStorage.json', jsonString); // and saves it in the file.
})