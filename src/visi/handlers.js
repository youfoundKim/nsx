const { VisiRoom, VisiUser, VisiItem } = require("./entities.js");
const Parsers = require("./parsers.js");

const handlers = new Map([
  ["v", handleVisiRoomMessage],
  ["A", handleVisiRoomPropsMessage],
  ["y", handleVisiUsersMessage],
  ["p", handleVisiJoinMessage],
  ["q", handleVisiPartMessage],
  ["x", handleVisiQuitMessage],
  ["V", handleVisiAddItemMessage],
  ["U", handleVisiRemoveItemMessage],
  ["!", handleVisiChatMessage],
  ["%", handleVisiWhisperMessage],
  [" ", handleVisiMoveMessage],
  ["3", handleVisiGameEventMessage]
]);

function handleReceivedVisiMessage(message, context) {
  message.split("*").forEach((message) => {
    routeVisiMessage(message, context)
  });
}

function handleSentVisiMessage(message, context) {
  message.split("*").forEach((message) => {
    routeVisiMessage(message, context)
  });
}

function routeVisiMessage(message, context) {
  const firstCharacter = message.charAt(0);

  // ignore ping message
  if (message === "ping") {
    return;
  }

  // save identity
  if (!context.state.identity && message.includes("VisiChat.server.ServerVisiPlayer&AACKVisiChat.x.actors.HHActor4_Consumer")) {
    return handleVisiIdentityMessage(message, context);
  }

  // get handler
  const handler = handlers.get(firstCharacter);
  if (handler) {
    return handler(message, context);
  }
}

// handle identity visi message
function handleVisiIdentityMessage(message, context) {
  context.state.identity = Parsers.parseVisiIdentityMessage(message);
  context.client.title = `NetStationen — ${context.state.identity.name}`;
}

// handle add item message
function handleVisiAddItemMessage(message, context) {
  const data = Parsers.parseVisiAddItemMessage(message);
  const item = new VisiItem(data);
  context.state.addItem(item);
}

// handle remove item message
function handleVisiRemoveItemMessage(message, context) {
  const data = Parsers.parseVisiRemoveItemMessage(message);
  const item = new VisiItem(data);
  context.state.removeItem(item);
}

// handle room message
function handleVisiRoomMessage(message, context) {
  if (message.includes("&AACKVisiChat.x.n.HHRoomState2")) {
    const data = Parsers.parseVisiRoomMessage(message);
    const room = new VisiRoom(data);
    context.state.room = room;
  }
}

// handle room info message
function handleVisiRoomPropsMessage(message, context) {
  const props = Parsers.parseVisiRoomPropsMessage(message);
  const tiles = Parsers.parseVisiRoomTiles(props);
  context.state.room.props = props;
  context.state.room.tiles = tiles;
}

// handle users message
function handleVisiUsersMessage(message, context) {
  const data = Parsers.parseVisiUsersMessage(message);
  data.forEach((data) => {
    const user = new VisiUser(data);
    context.state.addUser(user);
  });
}

// handle join message
function handleVisiJoinMessage(message, context) {
  const data = Parsers.parseVisiJoinMessage(message);
  const user = new VisiUser(data);
  context.state.addUser(user);
}

// handle part message
function handleVisiPartMessage(message, context) {
  const data = Parsers.parseVisiPartMessage(message);
  const user = context.state.getUserByOnlineId(data.onlineId);
  context.state.removeUser(user);
}

// handle quit message
function handleVisiQuitMessage(message, context) {
  const data = Parsers.parseVisiQuitMessage(message);
  const user = context.state.getUserByOnlineId(data.onlineId);
  context.state.removeUser(user);
}

// handle user chat message
function handleVisiChatMessage(message, context) {
  const data = Parsers.parseVisiChatMessage(message);
  const user = context.state.getUserByOnlineId(data.onlineId);
}

// handle user whisper message
function handleVisiWhisperMessage(message, context) {
  const data = Parsers.parseVisiWhisperMessage(message);
  const sender = context.state.getUserByOnlineId(data.sender);
  const receiver = context.state.getUserByOnlineId(data.receiver);
}

// handle move message
function handleVisiMoveMessage(message, context) {
  const data = Parsers.parseVisiMoveMessage(message);
  const user = context.state.getUserByOnlineId(data.onlineId);
  user?.move(data.x, data.y);
}

// handle game event message
function handleVisiGameEventMessage(data, context) {
  const { command, rest } = Parsers.parseVisiGameEventMessage(data);

  // Route game event
  switch (command) {
    case "hour": {
      //handleHourMessage(rest, context);
      break;
    }
  }
}

// Handle hour box message
function handleVisiHourMessage(data, context) {
  // Parse message
  const { hour, secret } = Parsers.parseHourMessage(data);
  // Send to Synapse.
  const delay = getRandomNumber(1000, 10000);
  setTimeout(() => {
    Client.shared.grabHour(secret);
  }, delay);
}

module.exports = {
  handleReceivedVisiMessage,
  handleSentVisiMessage
};