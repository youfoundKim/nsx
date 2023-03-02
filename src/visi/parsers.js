const { decodeString, decodeRoomName } = require("./util.js");

// parse visi props
function parseVisiProps(split, index) {
  const props = new Map();
  const count = parseInt(split[index]);
  const slice = split.slice(index + 1, index + 1 + count * 2);

  for (let i = 0; i < slice.length; i++) {
    const key = decodeString(slice[i++]);
    const val = decodeString(slice[i]);
    props.set(key, val);
  }

  return props;
}

// parse identity message
function parseVisiIdentityMessage(message) {
  const split = message.split(",", 6);

  return {
    onlineId: parseInt(split[0]),
    id: parseInt(split[1]),
    class: decodeString(split[2]),
    name: decodeString(split[3]),
    money: parseInt(split[4]),
    flags: parseInt(split[5])
  };
}

// parse user message
function parseVisiUser(message) {
  const split = message.split(",");

  return {
    onlineId: parseInt(split[0]),
    class: decodeString(split[1]),
    name: decodeString(split[2]),
    id: parseInt(split[3]),
    flags: parseInt(split[4]),
    money: parseInt(split[5]),
    roomId: parseInt(split[6]),
    x: parseInt(split[7]),
    y: parseInt(split[8]),
    time: parseInt(split[11]),
    props: parseVisiProps(split, 15)
  };
}

// parse users message
function parseVisiUsersMessage(message) {
  return message.substring(2)
    .split(",,")
    .map(parseVisiUser);
}

// parse user join message
function parseVisiJoinMessage(message) {
  return parseVisiUser(message.substring(2));
}

// parse user part message
function parseVisiPartMessage(message) {
  const split = message.split(",", 4);

  return {
    onlineId: parseInt(split[1]),
    roomId: parseInt(split[2]),
    roomName: decodeString(split[3])
  };
}

// parse user quit message
function parseVisiQuitMessage(message) {
  const split = message.split(",", 2);

  return {
    onlineId: parseInt(split[1])
  };
}

// parse add item message
function parseVisiAddItemMessage(message) {
  const split = message.split(",");

  return {
    id: parseInt(split[1]),
    name: decodeString(split[2]),
    roomId: parseInt(split[3]),
    userId: parseInt(split[4]),
    flags: parseInt(split[5]),
    type: parseInt(split[6]),
    value: parseInt(split[7]),
    class: decodeString(split[8]),
    x: parseInt(split[9]),
    y: parseInt(split[10]),
    props: parseVisiProps(split, 11)
  };
}

// parse remove item message
function parseVisiRemoveItemMessage(message) {
  const split = message.split(",", 11);

  return {
    id: parseInt(split[1]),
    name: decodeString(split[2]),
    roomId: parseInt(split[3]),
    userId: parseInt(split[4]),
    flags: parseInt(split[5]),
    type: parseInt(split[6]),
    value: parseInt(split[7]),
    class: decodeString(split[8]),
    x: parseInt(split[9]),
    y: parseInt(split[10])
  };
}

// parse room message
function parseVisiRoomMessage(message) {
  const split = message.split(",", 7);

  return {
    id: parseInt(split[1]),
    name: decodeRoomName(split[2]),
    flags: parseInt(split[3]),
    owner: parseInt(split[4]),
    time: parseInt(split[6])
  };
}

// parse room props message
function parseVisiRoomPropsMessage(message) {
  const split = message.split(",");

  return parseVisiProps(split, 5);
}

// parse room tile
function parseVisiTile(data) {
  const split = data.split("!", 7);

  return {
    gfx1: parseInt(split[0]),
    gfx2: parseInt(split[1]),
    angle: parseInt(split[2]),
    type: parseInt(split[3]),
    goto: parseInt(split[4]),
    url: decodeString(split[5]),
    zone: parseInt(split[6])
  };
}

// parse room tiles
function parseVisiRoomTiles(props) {
  return props.get("description")
    .split(",")
    .slice(9, 93)
    .map(parseVisiTile);
}

// parse chat message
function parseVisiChatMessage(message) {
  const split = message.split(",");

  return {
    onlineId: parseInt(split[1]),
    content: decodeString(split[2])
  };
}

// parse whisper message
function parseVisiWhisperMessage(message) {
  const split = message.split(",");

  return {
    sender: parseInt(split[1]),
    receiver: parseInt(split[2]),
    whisper: decodeString(split[3])
  };
}

function parseVisiMoveMessage(message) {
  const split = message.split(",", 4);

  return {
    onlineId: parseInt(split[1]),
    x: parseInt(split[2]),
    y: parseInt(split[3])
  };
}

function parseVisiGameEventMessage(message) {
  const [command, ...rest] = message.substring(2).split(",");

  return {
    command,
    rest
  };
}

function parseVisiHourMessage(message) {
  const split = message.split(":");

  return {
    hour: parseInt(split[0]),
    secret: split[1]
  };
}

module.exports = {
  parseVisiIdentityMessage,
  parseVisiUsersMessage,
  parseVisiJoinMessage,
  parseVisiPartMessage,
  parseVisiQuitMessage,
  parseVisiAddItemMessage,
  parseVisiRemoveItemMessage,
  parseVisiRoomMessage,
  parseVisiRoomPropsMessage,
  parseVisiChatMessage,
  parseVisiWhisperMessage,
  parseVisiMoveMessage,
  parseVisiRoomTiles,
  parseVisiGameEventMessage
};