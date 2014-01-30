function sayHello() {
  console.log("Hello!");
};

// Normal function call
sayHello();

function countToTen(callbackWhenFinished) {
  for (var i = 1; i <= 10; i++) {
    console.log(i);
  }

  callbackWhenFinished();
};

// Calling a function that expects a callback
// Will execute the callback function when it is done doing whatever it is supposed to do
countToTen(sayHello);
