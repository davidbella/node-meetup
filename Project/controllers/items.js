var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('items', server);

db.open(function (err, db) {
  if (err) throw err;
});

exports.findAll = function(req, res) {
  db.collection('itemscollection', function(err, collection) {
    collection.find().toArray(function(err, items) {
      res.send(items);
    });
  });
};

exports.findById = function(req, res) {
  var id = req.params.id;

  db.collection('itemscollection', function(err, collection) {
    collection.findOne({ '_id': new BSON.ObjectID(id) }, function(err, item) {
      res.send(item);
    });
  });
};

exports.addItem = function(req, res) {
  var item = req.body;

  db.collection('itemscollection', function(err, collection) {
    collection.insert(item, {safe: true}, function(err, result) {
      if (err) {
        res.send({'error': 'an error has occurred'});
      }
      else {
        res.send(result[0]);
      }
    });
  });
};

exports.updateItem = function(req, res) {
  var id = req.params.id;
  var item = req.body;

  db.collection('itemscollection', function(err, collection) {
    collection.update({ '_id': new BSON.ObjectID(id) }, item, {safe: true}, function(err, result) {
      if (err) {
        res.send({'error': 'an error has occurred'});
      }
      else {
        res.send(item);
      }
    });
  });
};

exports.deleteItem = function(req, res) {
  var id = req.params.id;

  db.collection('itemscollection', function(err, collection) {
    collection.remove({ '_id': new BSON.ObjectID(id) }, {safe: true}, function(err, result) {
      if (err) {
        res.send({'error': 'an error has occurred'});
      }
      else {
        res.send(req.body);
      }
    });
  });
};
