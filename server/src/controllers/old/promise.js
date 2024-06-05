const { Promise } = require("mongoose");

Promise.all = function (promises) {
  const mainPromise = new Promise();
  if (promises.length == 0) {
    mainPromise.resolve(null, promises);
  }

  let pending = 0;
  promises.forEach((p, i) => {
    pending++;
    p.then((val) => {
      promises[i] = val;
      if (--pending === 0) {
        mainPromise.resolve(null, promises);
      }
    }, (err) => {
      mainPromise.reject(err);
    });
  });

  return mainPromise;
};

module.exports = Promise;
