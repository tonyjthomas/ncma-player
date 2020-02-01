const { ipcRenderer } = require("electron");

const video = document.getElementById("player");
const overlay = document.getElementById("overlay");

const fadeInto = (videoPath, isResting) => {
  overlay.classList.add("fadeIn");

  setTimeout(() => {
    video.setAttribute("src", videoPath);
    if (!isResting) {
      video.onloadedmetadata = onLoadedMetaData;
    } else {
      video.onloadedmetadata = null;
    }
  }, 500)

  setTimeout(() => {
    overlay.classList.remove("fadeIn");
    overlay.classList.add("fadeOut");
  }, 1000);
}

const onLoadedMetaData = () => {
  setTimeout(onVideoEnded, video.duration * 1000 - 500);
}

const onVideoEnded = () => {
  ipcRenderer.send('ended');
  fadeInto("./assets/resting.mp4", true);
  video.onended = onLoopEnded;
}

const onLoopEnded = () => {
  video.play();
}

video.onended = onLoopEnded;

ipcRenderer.on('play', (_, message) => {
  fadeInto(message, false);
})