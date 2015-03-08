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

router.get('/user/:userID', function(req, res) {
    var db = req.db;
    var userID = req.params.userID;
    console.log("userID is " + userID);
    var collection = db.get('users');
    collection.find({"id":parseInt(userID)},{},function(e,user){
        console.log(user);
        res.render('profile', {
            "user" : user[0]
        });
    });
});

router.get('/event/:eventID', function(req, res) {
    var db = req.db;
    var eventID = req.params.eventID;
    var collection = db.get('events');
    collection.find({"id":parseInt(eventID)},{},function(e,events){
        res.render('event', {
            "event" : events[0]
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

router.get('/find-date', function(req, res) {
    var db = req.db;
    var collection = db.get('users');
    collection.find({},{},function(e,docs){
        res.render('find-date');
    });
});

module.exports = router;
