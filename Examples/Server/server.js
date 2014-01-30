var http = require('http');

var server = http.createServer(function(request, response) {
  response.writeHeader(200, {"Content-Type": "text/plain"});
  response.write("Hello from Node!\n");
  response.end();
});

server.listen(3000);
