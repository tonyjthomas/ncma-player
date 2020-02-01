// Modules to control application life and create native browser window
const {app, screen, ipcMain, BrowserWindow} = require('electron')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

let videoWindow

function createVideoWindow(display) {
  videoWindow = new BrowserWindow({
    x: display.bounds.x,
    y: display.bounds.y,
    fullscreen: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  videoWindow.loadFile('video.html')

  videoWindow.on('closed', function() {
    videoWindow = null
  })

  global.videoWindow = videoWindow;
}

function createWindow (display) {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    frame: true,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('picker.html')

  mainWindow.on('play', (event, message) => {
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

ipcMain.on('ended', () => mainWindow.webContents.send('ended'));

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  var displays = screen.getAllDisplays();
  
  var primary = screen.getPrimaryDisplay();
  
  var secondary = displays.find(d => d.id !== primary.id)
  
  createWindow(primary);
  createVideoWindow(secondary || primary);  
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()

  if (videoWindow === null) createVideoWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
