 const { ipcRenderer } = require("electron");

const video = document.getElementById("player");
const overlay = document.getElementById("overlay");

const timeouts = [];

const fadeInto = (videoPath, isResting) => {
  console.log(isResting);
  overlay.className = "";
  overlay.classList.add("fadeIn");

  timeouts.push(window.setTimeout(() => {
    video.setAttribute("src", videoPath);
    if (!isResting) {
      video.onloadedmetadata = onLoadedMetaData;
    } else {
      video.onloadedmetadata = null;
      video.onended = onLoopEnded;
    }
  }, 500));

  timeouts.push(window.setTimeout(() => {
    overlay.className = "";
    overlay.classList.add("fadeOut");
  }, 1000));
}

const onLoadedMetaData = () => {
  timeouts.push(window.setTimeout(onVideoEnded, video.duration * 1000 - 500));
}

const onVideoEnded = () => {
  ipcRenderer.send('ended');
  fadeInto("./assets/resting.mp4", true);
}

const onLoopEnded = () => {
  video.play();
}

video.onended = onLoopEnded;

ipcRenderer.on('play', (_, message) => {
  timeouts.forEach(t => window.clearTimeout(t));
  fadeInto(message, false);
})