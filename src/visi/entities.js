class VisiRoom {
  constructor(data) {
    Object.assign(this, data);
    this.items = new Map();
    this.uptime = Date.now() - data.time;
  }

  addItem(item) {
    this.items.set(item.id, item);
  }

  removeItem(item) {
    this.items.delete(item.id);
  }

  getRoomTime() {
    return Date.now() - this.uptime;
  }
}

class VisiUser {
  constructor(data) {
    Object.assign(this, data);
    this.items = new Map();
  }

  move(x, y) {
    this.x = x;
    this.y = y;
  }

  addItem(item) {
    this.items.set(item.id, item);
  }

  removeItem(item) {
    this.items.delete(item.id);
  }
}

class VisiItem {
  constructor(data) {
    Object.assign(this, data);
  }

  isOnUser() {
    return this.userId > 0;
  }

  isInRoom() {
    return this.roomId > 0;
  }
}


module.exports = {
  VisiRoom,
  VisiUser,
  VisiItem
};