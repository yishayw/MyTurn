var express = require('express'),
    app = module.exports = express.createServer(),
    room = require('./models/room'),
    invitation = require('./models/invitation.js'),
	vote = require('./models/vote.js'),
    db =    require('./db.js');

app.use(express.bodyParser());

app.get('/data/groups.json', function(req, res) {
    var result = db.load('groups');
    if (result == null) {
        result = {data: []};
    }
    res.send(result.data);
});

app.post('/data/doNothing.json', function (req, res) {
    res.send([], 200);
});

app.post('/data/groups.json', function(req, res) {
    var newGroupData = req.body;
    var result = db.load('groups');
    if(result == null) {
        result = { data: [] };
    }
    var newGroup = new room(newGroupData);
    result.data.push(newGroup);
    console.log('====== New group: name: ' + newGroup.name + ' discussion length: ' + newGroup.discussionLength);
    db.save({ id: 'groups', data: result.data });
    res.send(result.data, 200);
});