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

router.get('/settings', function(req, res, next) {
	res.render('settings');
});

router.get('/frontPage', function(req, res, next) {
	res.render('frontPage');
});

router.get('/matches', function(req, res, next) {
	res.render('matches');
});

router.get('/login', function(req, res, next) {
	var user = req.query.user;
	var password = req.query.password;

	console.log(req.query.user);
	var db = req.db;
	var collection = db.get('users');
	collection.find({"login":user, "password":password},{},function(e,users){
		var selectedUser = users[0];
		if(selectedUser == null){
			console.log("null");
			res.redirect('/');
		}
		else{
			req.session.username = selectedUser.login;
			req.session.user = selectedUser.name;
			req.session.userid = selectedUser.id;
			console.log(selectedUser);
			console.log(req.session.userid);
			res.redirect('/');
		}
    });
});

router.get('/find-people', function(req, res, next) {
	var db = req.db;
	var collection = db.get('users');
	collection.find({},{},function(e,docs){
        res.render('find-people', {
            "users" : docs,
            "me": parseInt(req.session.userid)
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
            	"events": events,
            	"me": parseInt(req.session.userid)
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
            "id": eventID,
            "me": parseInt(req.session.userid)
        });
    });
});

router.get('/users', function(req, res) {
    var db = req.db;
    var collection = db.get('users');
    collection.find({},{},function(e,docs){
        res.render('users', {
            "userlist" : docs,
            "me": parseInt(req.session.userid)
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
            	"event": events[0],
            	"me": parseInt(req.session.userid)
        	});
        });
    });
});

module.exports = router;
