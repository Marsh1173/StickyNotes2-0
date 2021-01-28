const { ipcRenderer, ipcMain } = require('electron')

var ifWillBeDeleted = false;
var windowArgs = window.process.argv.slice(-1);
document.getElementById("text").value = windowArgs[0];



document.querySelector('#optionButton').addEventListener('click', function(e) {
    document.getElementById("optionMenu").classList.toggle("hidden");
    e.target.classList.toggle('optionButtonToggled');
})


document.getElementById("headerColor").addEventListener("change", function() {
    //this detects when you use the header color slider, needs to be implemented
}, false);


document.getElementById("minimize").onclick = function(){
    ipcRenderer.send('rendererMessage', ["minimize"]);
}
document.getElementById("delete").onclick = function(){
    ifWillBeDeleted = true;
    ipcRenderer.send('rendererMessage', ["delete"]);
}
document.getElementById("new").onclick = function(){
    ipcRenderer.send('rendererMessage', ["new"]);
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
                //we can add more, such as font size, color, etc
            }]
        );
    }
}