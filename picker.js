const { remote, ipcRenderer } = require("electron");

var videoWindow = remote.getGlobal("videoWindow");

var buttons = document.querySelectorAll("button");
buttons.forEach(b => 
    b.onclick = e => {
        buttons.forEach(b2 => b2.disabled = false);
        b.disabled = true;
        var videoPath = e.target.getAttribute("data-video-path");
        videoWindow.webContents.send('play', videoPath);
    }
);

ipcRenderer.on('ended', () => buttons.forEach(b => b.disabled = false));