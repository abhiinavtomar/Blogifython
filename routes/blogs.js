var express     = require("express"),
    router      = express.Router(),
    User        = require("../models/user"),
    Blog        = require("../models/blog");

//   Showing All BLOGS
router.get("/", isLoggedIn, function(req, res){
    User.findById(req.user._id).populate('blogs').exec(function(err, user){
        if(err) {
            console.log(err);
        }
        else {
            res.render("index", {user: user});
        }
    });
});

//  CREATE NEW BLOG FORM
router.get("/new",isLoggedIn, function(req, res) {
    res.render("new"); 
});

//  CREATE NEW BLOG
router.post("/", isLoggedIn, function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, blog){
        if(err) {
            req.flash("error", "Post not created !!!");
            res.redirect("/blogs/" + req.params.id);
        }
        else {
            blog.owner.push(req.user);
            blog.save();
            req.user.blogs.push(blog);
            req.user.save();
            req.flash("success", "Post created successfully ...");
            res.redirect("/blogs");
        }
    }); 
});

//  SHOW A BLOG 
router.get("/:id", isLoggedIn, function(req, res) {
    Blog.findById(req.params.id).populate({path: 'owner comments'}).exec(function(err, blog){
        if(err) {
            console.log(err);
            res.redirect("/blogs");
        }      
        else {
            res.render("show", {blog: blog});
        }
    });
});

//  EDIT A BLOG 
router.get("/:id/edit", isLoggedIn, function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if(err) {
            res.redirect("/blogs");
        }
        else {
            if(blog.owner[0].equals(req.user._id)) {
                res.render("edit", {blog: blog});
            } else {
                res.render("show", {blog: blog});   
            }
        }
    });
});

//  UPDATE A BLOG
router.put("/:id",isLoggedIn, function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
     Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
            if(err) {
                req.flash("error", "Post not updated !!!");
                res.redirect("/blogs");
            } 
            else {
                req.flash("success", "Post updated successfully ...");
                res.redirect("/blogs/"+ req.params.id);
            }
     });
});

//  6.  DELETE
router.delete("/:id",isLoggedIn, function(req, res){
        Blog.findById(req.params.id, function(err, blog) {
           if(blog.owner[0].equals(req.user._id)) {
               req.flash("error", "You dont have delete permission !!!");
               res.redirect("/blogs");
           } else {
               blog.remove(err, function(err) {
                  if(err) {
                        console.log(err);
                        req.flash("error", "Something happened !!!");
                        res.redirect("/blogs");
               }
               else {
                   req.flash("success", "Post deleted successfully ...");
                   res.redirect("/blogs");
               } 
               });
           }
        });
});

//  MIDDLEWARE
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "LOGIN to proceed further ...");
    res.redirect("/login");
}

module.exports = router;