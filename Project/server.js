var express = require('express'),
    items = require('./controllers/items');

var path = require('path');
var app = express();

app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.end('Hello Node!');
});

app.get('/items', items.findAll);
app.get('/items/:id', items.findById);
app.post('/items', items.addItem);
app.put('/items/:id', items.updateItem);
app.delete('/items/:id', items.deleteItem);

app.listen(3000);
