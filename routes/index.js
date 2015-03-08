var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var db = req.db;
	var collection = db.get('events');
	collection.find({},{},function(e,docs){
        res.render('index', {
            "events" : docs
        });
    });
});

router.get('/find-people', function(req, res, next) {
	var db = req.db;
	var collection = db.get('users');
	collection.find({},{},function(e,docs){
        res.render('find-people', {
            "users" : docs
        });
    });
});

router.get('/user/:userID', function(req, res) {
    var db = req.db;
    var userID = req.params.userID;
    console.log("userID is " + userID);
    var collection = db.get('users');
    var event_collection = db.get('events');
    collection.find({"id":parseInt(userID)},{},function(e,user){
    	event_collection.find({"id": { $in: user[0].attending}},{},function(e,events){
    		console.log(events);
        	res.render('profile', {
            	"user" : user[0],
            	"events": events
        	});
        });
    });
});

router.get('/event/:eventID', function(req, res) {
    var db = req.db;
    var eventID = req.params.eventID;
    var collection = db.get('events');
    collection.find({"id":parseInt(eventID)},{},function(e,events){
        res.render('event', {
            "event" : events[0],
            "id": eventID
        });
    });
});

router.get('/users', function(req, res) {
    var db = req.db;
    var collection = db.get('users');
    collection.find({},{},function(e,docs){
        res.render('users', {
            "userlist" : docs
        });
    });
});

router.get('/find-date/:eventID', function(req, res) {
    var db = req.db;
    var eventID = req.params.eventID;
    var collection = db.get('users');
    var event_collection = db.get('events');
    event_collection.find({"id":parseInt(eventID)},{},function(e,events){
    	collection.find({"attending": parseInt(eventID)},{},function(e,users){
    		console.log(events);
    		console.log(users);
    		var first = users[0];
    		users.splice(0,1);
        	res.render('find-date', {
        		"first": first,
            	"users" : users,
            	"event": events[0]
        	});
        });
    });
});

module.exports = router;
