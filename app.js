var express             = require("express"),
    app                 = express(),
    mongoose            = require("mongoose"),
    bodyParser          = require("body-parser"),
    methodOverride      = require("method-override"),
    expressSanitizer    = require("express-sanitizer");
   
//   APP CONFIG
mongoose.connect("mongodb://localhost:27017/blogapp", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//   MONGOOSE/MODEL CONFIG 
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
}),
    blogs = mongoose.model("blog", blogSchema);

//   RESTful ROUTES
app.get("/",function(req, res) {
    res.redirect("/blogs");
});

//   1. INDEX
app.get("/blogs", function(req, res){
    blogs.find({}, function(err, blogs){
        if(err) {
            console.log(err);
        }
        else {
            res.render("index", {blogs: blogs});
        }
    });
});

//  2.  NEW
app.get("/blogs/new", function(req, res) {
    res.render("new"); 
});

//  3.  CREATE
app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    blogs.create(req.body.blog, function(err, blog){
        if(err) {
            res.render("new");
        }
        else {
            res.redirect("/blogs");
        }
    }); 
});

//  3.  SHOW 
app.get("/blogs/:id", function(req, res) {
    blogs.findById(req.params.id, function(err, blog){
        if(err) {
            res.redirect("/blogs");
        }      
        else {
            res.render("show", {blog: blog});
        }
    });
});

//  4.  EDIT 
app.get("/blogs/:id/edit",function(req, res) {
    blogs.findById(req.params.id, function(err, blog) {
        if(err) {
            res.redirect("/blogs");
        }
        else {
            res.render("edit", {blog: blog});
        }
    });
});

//  5.  UPDATE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
     blogs.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
            if(err) {
                res.redirect("/blogs");
            } 
            else {
                res.redirect("/blogs/"+ req.params.id);
            }
     });
});

//  6.  DELETE
app.delete("/blogs/:id", function(req, res){
    blogs.findByIdAndRemove(req.params.id, function(err){
       if(err) {
           res.redirect("/blogs");
       }
       else {
           res.redirect("/blogs");
       }
    });
});
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started..."); 
});