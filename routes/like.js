var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Blog        = require("../models/blog"),
    User        = require('../models/user');

    // Liking A Post
router.post('/1', isLoggedIn, function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if(err) {
            console.log(err);
            res.json({'res': 0});
        } else {
            var index = blog.likes.findIndex(userId => userId == req.user.id); 
            if(index != -1) {
                res.json({'res': 2});
            } else {
                blog.likes.push(req.user.id);
                blog.save();
                res.json({'res': 1, count:blog.likes.length});
            }
        }
    });
});
    // Unliking A Post
router.post('/0', isLoggedIn, function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if(err) {
            console.log(err);
            res.json({'res': 0});
        } else {
            var index = -1;
            index = blog.likes.findIndex((userId)=> {
                return userId == req.user.id;
            });
            if(index != -1) {
                blog.likes.splice(index, 1);
                blog.save();
                res.json({'res': 1, count:blog.likes.length});
            } else {
                res.json({'res': 2});
            }
            
        }
    });
});
    //  MIDDLEWARE
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.json({'res': 0});
}

module.exports = router;