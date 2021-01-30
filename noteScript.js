const { ipcRenderer, ipcMain } = require('electron')



var ifWillBeDeleted = false;
var optionMenuClosed = true;
var windowArgs = window.process.argv.slice(-4);
document.getElementById("text").value = windowArgs[0];

var fontSize = parseInt(windowArgs[1]);
document.getElementById("text").style.fontSize = fontSize + "pt";
document.getElementById("fontSize").value = fontSize;

var noteColorElement = document.getElementById("noteColor");
var noteColor = windowArgs[3];

var opacity = parseFloat(windowArgs[2]);
document.getElementById("opacity").value = opacity;

updateColors();
noteColorElement.style.backgroundColor = rbgaFromColor(noteColor) + "1)";






document.getElementById("minimize").onclick = function(){
    //console.log(noteColor);
    ipcRenderer.send('rendererMessage', ["minimize"]);
}
document.querySelector('#optionButton').addEventListener('click', function(e) {
    optionMenuClosed = !optionMenuClosed;
    document.getElementById("optionMenu").classList.toggle("hidden");
    //e.target.classList.toggle('optionButtonToggled');
});
document.getElementById("text").addEventListener('click', function() {
    if (!optionMenuClosed) {
        optionMenuClosed = !optionMenuClosed;
        document.getElementById("optionMenu").classList.toggle("hidden");
        //e.target.classList.toggle('optionButtonToggled');
    }
});

document.getElementById("noteColor").addEventListener("change", function(e) {
    noteColor = noteColorElement[noteColorElement.selectedIndex].value;
    updateColors();
    noteColorElement.style.backgroundColor = rbgaFromColor(noteColor) + "1)";
}, false);
document.getElementById("opacity").addEventListener("change", function() {
    updateColors();
}, false);
document.getElementById("fontSize").addEventListener("change", function() {
    fontSize = document.getElementById("fontSize").value;
    document.getElementById("text").style.fontSize = fontSize + "pt";
}, false);


document.getElementById("delete").onclick = function(){
    ifWillBeDeleted = true;
    ipcRenderer.send('rendererMessage', ["delete"]);
}
document.getElementById('closeAll').onclick = function(){
    ipcRenderer.send('rendererMessage', ["closeAll"]);
}
document.getElementById("new").onclick = function(){
    ipcRenderer.send('rendererMessage', ["new",
        {
            "fontSize": fontSize,
            "opacity": opacity,
            "noteColor": noteColor,
        }]
    );
}



window.onbeforeunload = (e) => {
    if (!ifWillBeDeleted) {
        ipcRenderer.send('rendererMessage', ["closing",
            {
                "text": document.getElementById("text").value, 
                "width": window.innerWidth,
                "height": window.innerHeight,
                "screenX": window.screenX,
                "screenY": window.screenY,
                "fontSize": fontSize,
                "opacity": opacity,
                "noteColor": noteColor,
            }]
        );
    }
}

function updateColors() {
    opacity = document.getElementById("opacity").value;
    document.getElementById("header").style.backgroundColor = rbgaFromColor(noteColor) + "0.952)";
    document.getElementById("text-div").style.backgroundColor = rbgaFromColor(noteColor) + opacity + ")";
}

function rbgaFromColor(color) {
    switch (color) {
        case "black" :
            return "rgba( 0, 0, 0, ";
        case "gray" :
            return "rgba( 60, 60, 60, ";
        case "white" :
            return "rgba( 127, 127, 127, ";
        case "navy" :
            return "rgba( 0, 0, 127, ";
        case "blue" :
            return "rgba( 0, 76, 127, ";
        case "cyan" :
            return "rgba( 26, 102, 102, ";
        case "pistachio" :
            return "rgba( 0, 127, 76, ";
        case "green" :
            return "rgba( 26, 102, 26, ";
        case "lime" :
            return "rgba( 76, 127, 26, ";
        case "yellow" :
            return "rgba( 127, 127, 0, ";
        case "orange" :
            return "rgba( 127, 51, 0, ";
        case "red" :
            return "rgba( 127, 0, 0, ";
        case "magenta" :
            return "rgba( 127, 26, 76, ";
        case "purple" :
            return "rgba( 102, 0, 104, ";
        default :
            console.log("tried to find bad color");
            return "rgba( 0, 0, 0, ";
    }
}