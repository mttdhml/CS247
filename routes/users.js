var express = require('express');
var router = express.Router();

//*GET users listing. */
router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('users');
    collection.find({},{},function(e,docs){
        res.render('users', {
            "userlist" : docs
        });
    });
});

exports.getprofile = function(req, res) {
		var itemID = req.params.itemID;
		var db = req.db;
    	var collection = db.get('users');
    	collection.find({_id:userID},{},function(e,docs){
        /*res.render('profile', {
            "user" : docs
        });*/
        res.render('profile');
    });

}

module.exports = router;
