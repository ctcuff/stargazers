function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// helper for ints in range
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

// helper for -1 - 1
function getRandomDir() {
  return Math.random() * 2 - 1;
}

export { deg2rad, getRandomInt, getRandomDir };