var express = require('express'),
    app = module.exports = express.createServer(),
    db =    require('./db.js'),
    invitation = require('./models/invitation.js'),
    vote = require('./models/vote.js');

app.use(express.bodyParser());

app.get('/data/groups.json', function(req, res) {
    var result = db.load('groups');
    if (result == null) {
        result = {data: []};
    }
//    res.header('content-type', 'application/x-javascript');
    res.send(result.data);
});

app.post('/data/groups.json', function(req, res) {
    var newGroup = req.body;
    var result = db.load('groups');
    if(result == null) {
        result = { data: [] };
    }
    result.data.push(newGroup);
    db.save({ id: 'groups', data: result.data });
    res.send(result.data, 200);
});