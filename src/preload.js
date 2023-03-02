const { ipcRenderer } = require("electron");

// hook websocket
WebSocket = class extends WebSocket {
  constructor(url, proto) {
    super(url, proto);
    super.addEventListener("open", () => ipcRenderer.send("open"));
    super.addEventListener("close", () => ipcRenderer.send("close"));
    super.addEventListener("message", (message) => ipcRenderer.send("message", message.data));
  }
}

/*

  send(data) {
    super.send(data);
    ipcRenderer.send("visi", data);
  }
*/