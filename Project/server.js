var express = require('express'),
    items = require('./controllers/items');

var app = express();

app.get('/', function (req, res) {
    res.end('Hello Node!');
});

app.get('/items', items.findAll);
app.get('/items/:id', items.findById);
app.post('/items', items.addItem);
app.put('/items/:id', items.updateItem);
app.delete('/items/:id', items.deleteItem);

app.listen(3000);
