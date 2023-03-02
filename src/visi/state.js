class VisiState {
  constructor() {
    this.users = new Map();
    this.room = null;
  }

  getUserById(id) {
    return this.users.get(id);
  }

  getUserByOnlineId(onlineId) {
    const users = this.users.values();

    for (const user of users) {
      if (user.onlineId === onlineId) {
        return user;
      }
    }
  }

  addUser(user) {
    this.users.set(user.id, user);
  }

  removeUser(user) {
    this.users.delete(user.id);
  }

  addItem(item) {
    if (item.isOnUser()) {
      const user = this.getUserById(item.userId);
      user.addItem(item);
    } else if (item.isInRoom()) {
      this.room.addItem(item);
    }
  }

  removeItem(item) {
    if (item.isOnUser()) {
      const user = this.getUserById(item.userId);
      user.removeItem(item);
    } else if (item.isInRoom()) {
      this.room.removeItem(item);
    }
  }
}

module.exports = VisiState;