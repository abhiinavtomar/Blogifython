var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Blog        = require("../models/blog"),
    Comment     = require("../models/comment");

//  CREATE NEW COMMENT
router.post("/", isLoggedIn, function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if(err) {
            console.log(err);
            req.flash("error", "Comment not created");
            res.redirect("/blogs/" + req.params.id);
        } else {
            var commentobj = { text: req.body.comment, author: req.user.username};
            Comment.create( commentobj, function(err, comment) {
                if(err) {
                    console.log(err);
                    req.flash("error", "Comment not created !!!");
                    res.redirect("/blogs/" + req.params.id);
                } else {
                    blog.comments.push(comment);
                    blog.save();
                    req.flash("success", "Comment Added Successfully ...");
                    res.redirect("/blogs/" + req.params.id);
                }
            });
        }
    }); 
});

//  EDIT 
router.delete("/:commentid", function(req, res) {
    Comment.findById(req.params.commentid, function(err, comment){
        if(err) {
            console.log(err);
            req.flash("error", "Comment not deleted !!!");
            res.redirect("/blogs/" + req.params.id);
        } else {
            if(req.user.username == comment.author) {
                comment.remove(err, function(err) {
                    if(err) {
                        console.log(err);
                        req.flash("error", "Comment not deleted !!!");
                        res.redirect("/blogs/" + req.params.id);
                    } else {
                        req.flash("success", "Comment Deleted Successfully ...");
                        res.redirect("/blogs/" + req.params.id);     
                    }
                });   
            }
        }
       
    });
});

//  MIDDLEWARE
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "LOGIN to proceed further !!!");
    res.redirect("/login");
}

module.exports = router;