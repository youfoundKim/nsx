const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const Context = require("./context.js");
const { handleReceivedVisiMessage, handleSentVisiMessage } = require("./visi/handlers.js");

if (require("electron-squirrel-startup")) {
  app.quit();
}

require("update-electron-app")();

// TODO:
// add coords to tiles
// add tile functions
// clear users on new room, or move users into room to better reflect server state
// wait with handling packets until connected and solved strangebase

const ctx = new Map();
let tmp = 0;

// create main window and load n.dk
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 515,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: false,
      partition: `${tmp++}`
    }
  });

  win.loadURL("https://www.netstationen.dk/visi/client.asp", {
    httpReferrer: "https://netstationen.dk/", // check if this is needed
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
  });

  const context = new Context(win);
  const id = win.webContents.id;
  ctx.set(id, context);
  
  win.on("closed", () => {
    ctx.delete(id);
  });
}

// create main app window when the app is ready
app.on("ready", () => {
  createWindow();
});

// quit the app when all windows are closed
app.on("window-all-closed", () => {
  app.quit();
});

// handle connect
ipcMain.on("open", (event, message) => {
  const context = ctx.get(event.sender.id);
  context.connected = true;
  context.state.identity = null;
});

// handle disconnect
ipcMain.on("close", (event, message) => {
  const context = ctx.get(event.sender.id);
  context.connected = false;
});

// handle visi messages from hooked websockets
ipcMain.on("message", (event, message) => {
  const context = ctx.get(event.sender.id);
  handleReceivedVisiMessage(message, context);
});

global.state = ctx;