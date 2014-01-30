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

};

exports.findById = function(req, res) {

};

exports.addItem = function(req, res) {

};

exports.updateItem = function(req, res) {

};

exports.deleteItem = function(req, res) {

};
