var fs = require('fs');
var contents = "Placeholder String";

function printFileInfo() {
  var lineCount = contents.split("\n").length - 1
  console.log(contents);
  console.log("Total number of lines: " + lineCount);
};

fs.readFile('./test.txt', function(err, data) {
  if (!err) {
    contents = data.toString();
    console.log("Finished reading contents!");
  }
});

printFileInfo();
