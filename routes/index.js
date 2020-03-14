var express         = require("express"),
    router          = express.Router(),
    passport        = require("passport"),
    Blog            = require("../models/blog"),
    User            = require("../models/user");

//   RESTful ROUTES
router.get("/",function(req, res) {
    Blog.find().populate({path: 'owner likes'}).exec(function(err, blogs) {
        if(err) {
            res.redirect("/");
        } else {
            res.render("landing", {blogs: blogs});    
        }
    });
});

//  LOGIN
router.get("/login", function(req, res) {
    res.render("login"); 
});

//  LOGIN POST
router.post("/login", passport.authenticate("local", {
    
    successRedirect: "/blogs",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: "Welcome back to BLOG APP..."
}), function(req, res){});

//  REGISTER
router.get("/register", function(req, res) {
    res.render("register"); 
});

//  REGISTER POST
router.post("/register", function(req, res) {
     User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }   
            Blog.create({
                title: "Example Post", 
                image: "https://images.unsplash.com/photo-1545051522-b961890b306d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
                body: "This is an example post for you to explore the features of this BLOG APP....Enjoy",
                owner: user._id
            }, function(err, blog){
                    if(err) {
                        req.flash("error", "Blog not created !!!");
                        res.render("new");
                    }
                    else {
                        user.blogs.push(blog);
                        user.save();
                        passport.authenticate("local")(req, res, function(){
                            req.flash("success", "Welcome to BLOG APP...");
                            res.redirect("/blogs");
                        }); 
                    }
            });
    });
});

//  LOGOUT
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out, come back soon !!!");
    res.redirect("/");
});

router.get("*", function(req, res) {
    res.render("other"); 
});



module.exports = router;