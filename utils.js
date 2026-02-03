function getRandom(array) {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

function doTask() {
  const ms = getRandom([100, 150, 1000, 2000, 300]);
  const shouldThrowError = getRandom([1, 2, 3, 4, 5]) === 5;

  if (shouldThrowError) {
    const randErr = getRandom([
      "DB call failed",
      "API server down",
      "Access denied",
      "Resource not found"
    ]);
    throw new Error(randErr);
  }

  return new Promise((resolve) => {
    setTimeout(() => resolve(ms), ms);
  });
}

module.exports = doTask;
