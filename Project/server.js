var express = require('express'),
    items = require('./controllers/items');

var path = require('path');
var app = express();

var faye = require('faye');
var http = require('http');

var bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});
var server = http.createServer();
bayeux.attach(server);
server.listen(3001);

function sendUpdateMessage() {
  bayeux.getClient().publish('/faye', {text: 'message'});
};

app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.end('Hello Node!');
});

app.get('/items', items.findAll);
app.get('/items/:id', items.findById);
app.post('/items', function(req, res) {
  sendUpdateMessage();
  console.log("here");
  items.addItem(req, res);
});
app.put('/items/:id', items.updateItem);
app.delete('/items/:id', items.deleteItem);

app.listen(3000);
