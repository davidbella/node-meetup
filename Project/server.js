var express = require('express'),
    items = require('./controllers/items');

var app = express();

app.get('/', function (req, res) {
    res.end('Hello Node!');
});

app.get('/items', item.findAll);
app.get('/items/:id', item.findById);
app.post('/items', item.addItem);
app.put('/items/:id', item.updateItem);
app.delete('/items/:id', item.deleteItem);
