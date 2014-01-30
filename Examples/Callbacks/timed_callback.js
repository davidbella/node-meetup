var sleep = require('sleep');

function mySetTimeout(seconds, callback) {
  while (seconds > 0) {
    console.log("Sleeping... " + seconds);
    sleep.sleep(1);
    seconds--;
  }
  callback();
};

mySetTimeout(3, function() {
  console.log("Hello");
});

console.log("Test");
