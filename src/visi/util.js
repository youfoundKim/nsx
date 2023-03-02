function decodeString(string) {
  const charCodes = [];

  for (let i = 0; i < string.length; i++) {
    const charCode = string.charCodeAt(i);

    if (charCode === 38) {
      let r = 0;

      for (let j = 0; j < 4; j++) {
        i += 1;
        r *= 16;
        r += string.charCodeAt(i) - 65;
      }

      charCodes.push(r);
    } else
      charCodes.push(charCode);
  }

  return String.fromCharCode(...charCodes);
}

function encodeString(string) {
  const charCodes = [];

  for (let i = 0; i < string.length; i++) {
    let charCode = string.charCodeAt(i);

    if (charCode < 32 || charCode > 127 || charCode === 42 || charCode === 38 || charCode === 44 || charCode === 39) {
      charCodes.push(38);
      for (let j = 0; j < 4; j++) {
        charCodes.push(65 + ((charCode & 61440) >> 12));
        charCode <<= 4;
      }
    } else {
      charCodes.push(charCode);
    }
  }

  return String.fromCharCode(...charCodes);
}

function decodeRoomName(string) {
  const decoded = decodeString(string);
  const index = decoded.indexOf('*');
  const name = decoded.substring(0, index);

  return name;
}

function newMapTiles(tiles) {
  const iter = tiles.values();

  for (let i = 0; i < 12; i++) {
    for (let j = 0; j < 7; j++) {
      const { x, y } = calcCoords(i, j);
      const { value } = iter.next();
      value.x = x;
      value.y = y;
    }
  }
}

function calcCoords(row, col) {
  const x = (row % 2) !== 0
    ? (col * 68) + 34
    : (col * 68);

  const y = (row * 34) + 26;

  return {
    x, y
  };
}

module.exports = {
  encodeString,
  decodeString,
  decodeRoomName
};