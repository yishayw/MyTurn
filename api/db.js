// For this demo, using an in-memory store. Could easily switch to persistent storage with Mongo or similar.
var uuid = require('node-uuid'),
    persistentDb = require('mongojs').connect('mongodb://time:123@alex.mongohq.com:10019/TimeAllocation'),
    items = [];

exports.load = function(id) {
    return items[id] ? JSON.parse(items[id]) : null;
};

exports.save = function(item) {
    if(!item.id) {
        item.id = uuid.v4().replace(/\-/g, '').substring(0, 8);
    }
    items[item.id] = JSON.stringify(item);
};

exports.remove = function(id) {
    delete items[id];
}

exports.savePersistent = function(collectionName, object, callback) {
    var collectionObject = persistentDb.collection(collectionName);
    collectionObject.save(object, callback);
}

exports.find = function(collectionName, queryObject, callback) {
    var collectionObject = persistentDb.collection(collectionName);
    if(!queryObject) {
        queryObject = {};
    }
    collectionObject.find(queryObject).forEach(callback);
}