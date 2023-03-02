const VisiState = require("./visi/state.js");

class Context {
  constructor(client) {
    this.state = new VisiState();
    this.client = client;
    this.count = 0;
    this.connected = false;
  }
}

module.exports = Context;