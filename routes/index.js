var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/find-event', function(req, res, next) {
	var db = req.db;
	var collection = db.get('events');
	console.log("user " + req.session.userid);
	collection.find({},{},function(e,docs){
        res.render('find-event', {
            "events" : docs,
            "me": parseInt(req.session.userid)
        });
    });
});

router.get('/chat/:userid', function(req, res, next) {
	var db = req.db;
	var collection = db.get('chats');
	var otherID = parseInt(req.params.userid);
	var selfID = parseInt(req.session.userid);
	collection.find({$or:[{$and:[{"to":selfID},{"from":otherID}]}, {$and:[{"to":otherID},{"from":selfID}]}]},{},function(e,docs){
        docs.sort(function(a,b) { return parseInt(a.order) - parseInt(b.order) } );
        console.log(docs);
        docs.forEach(function(element, index, array) {
    		if(element.from == selfID){
    			element.sent = true;
    		}
		});
        
        res.render('chat', {
            "messages" : docs,
            "me": parseInt(req.session.userid)
        });
    });
});

router.get('/logout', function(req, res, next) {
	delete req.session.username;
	delete req.session.user;
	delete req.session.userid;

    res.redirect('/find-event');    
});




router.post('/accept', function(req, res) {
	var id = parseInt(req.body.id);
	var userid = parseInt(req.session.userid);
	console.log("ID is " + id);

	var db = req.db;
	var collection = db.get('matchrequest');
	collection.remove({"invited":parseInt(userid), "inviter":parseInt(id)},{});

	var user_collection = db.get('users');
	user_collection.update({"id":userid}, {$addToSet:{"talking":id}});
	user_collection.update({"id":id}, {$addToSet:{"talking":userid}});

    res.redirect('/matches');    

});

router.post('/reject', function(req, res) {
	var id = req.body.id;
	var userid = req.session.userid;
	console.log("ID is " + id);

	var db = req.db;
	var collection = db.get('matchrequest');

	collection.remove({"invited":parseInt(userid), "inviter":parseInt(id)},{});
    res.redirect('back');    
});

router.get('/settings', function(req, res, next) {
	if(isNaN(req.session.userid)){
    	res.redirect('/frontPage');
    	return;
    }
	res.render('settings', {
            "me": parseInt(req.session.userid)
    });
});

router.get('/frontPage', function(req, res, next) {
	res.render('frontpage');
});

router.get('/matches', function(req, res, next) {
	if(isNaN(req.session.userid)){
    	res.redirect('frontPage');
    	return;
    }
    var db = req.db;
	var collection = db.get('matchrequest');
	var user_collection = db.get('users');
    collection.find({"invited":parseInt(req.session.userid)},{},function(e,requests){
    	var inviters= [];
    	requests.forEach(function(element, index, array) {
    		inviters.push(element.inviter);
		});
		user_collection.find({"id": { $in: inviters}},{},function(e,matches){
	    		console.log(matches);
	    		user_collection.find({"id": parseInt(req.session.userid)},{},function(e,myself){
	    			var myuser = myself[0];
	        		user_collection.find({"id": {$in: myuser.talking}},{},function(e,convos){
	        			console.log(convos);
	        			res.render('matches', {
	            			"me": parseInt(req.session.userid),
	            			"users": matches,
	            			"convos": convos
	    				});
	    			});
	    		});
        	
        });	
    });
    
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
			res.redirect('/find-event');
		}
		else{
			req.session.username = selectedUser.login;
			req.session.user = selectedUser.name;
			req.session.userid = selectedUser.id;
			console.log(selectedUser);
			console.log(req.session.userid);
			res.redirect('/find-event');
		}
    });
});

router.get('/find-people', function(req, res, next) {
	var db = req.db;
	var collection = db.get('users');
	collection.find({},{},function(e,docs){
        res.render('find-people', {
            "users" : docs,
            "me": parseInt(req.session.userid),
            "exists": !isNaN(req.session.userid)
        });
    });
});

router.get('/user/:userID', function(req, res) {
    var db = req.db;
    var userID = req.params.userID;
    if(isNaN(userID)){
    	res.redirect('/frontPage');
    	return;
    }
    console.log("userID is " + userID);
    var collection = db.get('users');
    var event_collection = db.get('events');
    collection.find({"id":parseInt(userID)},{},function(e,user){
    	event_collection.find({"id": { $in: user[0].attending}},{},function(e,events){
    		console.log(events);
        	res.render('profile', {
            	"user" : user[0],
            	"events": events,
            	"me": req.session.userid,
            	"exists": !isNaN(req.session.userid)
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
            "me": parseInt(req.session.userid),
            "exists": !isNaN(req.session.userid)
        });
    });
});

router.get('/users', function(req, res) {
    var db = req.db;
    var collection = db.get('users');
    collection.find({},{},function(e,docs){
        res.render('users', {
            "userlist" : docs,
            "me": parseInt(req.session.userid),
            "exists": !isNaN(req.session.userid)
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
            	"me": parseInt(req.session.userid),
            	"exists": !isNaN(req.session.userid)
        	});
        });
    });
});

module.exports = router;
