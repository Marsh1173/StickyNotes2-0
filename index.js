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
            let fontSize = "15";
            if ("fontSize" in json[i]) fontSize = json[i]["fontSize"];
            let opacity = "0.486";
            if ("opacity" in json[i]) opacity = json[i]["opacity"];
            let noteColor = "black";
            if ("noteColor" in json[i]) {
                noteColor = json[i]["noteColor"];
                console.log(noteColor)
            }
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
                    additionalArguments: [json[i]["text"], fontSize, opacity, noteColor],
                },
            })
            tempWindow.loadFile('noteIndex.html');
        }
    }
});

function makeNewWindow(fontSize = "15", opacity = "0.486", noteColor = "black") { // make new blank window
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
            additionalArguments: ["New note", fontSize, opacity, noteColor],
        },
    })
    tempWindow.loadFile('noteIndex.html');
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
                },
                "fontSize": (arg[1]["fontSize"].toString()),
                "opacity": (arg[1]["opacity"].toString()),
                "noteColor": arg[1]["noteColor"],
            })
            break;
        case "new" :
            makeNewWindow((arg[1]["fontSize"].toString()), (arg[1]["opacity"].toString()), arg[1]["noteColor"]);
            break;
        case "closeAll" :
            app.quit();
            break;
        default:
            throw new Error("Unrecognized renderer command")
    }
});

app.on('will-quit', () => { // called before the whole application closes
    const jsonString = JSON.stringify(savedWindowsJson); // json-ifies the global variable
    fs.writeFileSync('./windowStorage.json', jsonString); // and saves it in the file.
})