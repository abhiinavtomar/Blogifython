var express                 = require("express"),
    app                     = express(),
    flash                   = require("connect-flash"),
    mongoose                = require("mongoose"),
    bodyParser              = require("body-parser"),
    methodOverride          = require("method-override"),
    expressSanitizer        = require("express-sanitizer"),
    passport                = require("passport"),
    passportLocal           = require("passport-local"),
    User                    = require("./models/user");
    
//  REQUIRING ROUTES
var commentRoutes    = require("./routes/comments"),
    blogRoutes       = require("./routes/blogs"),
    indexRoutes      = require("./routes/index");
   
//   APP CONFIG
var url = process.env.DATABASEURL || "mongodb://localhost:27017/blogapp";
mongoose.connect(url, {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//  PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "abhiinavtomar",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser   = req.user;
   res.locals.error         = req.flash("error");
   res.locals.success       = req.flash("success");
   next();
});

//  ROUTES
app.use("/blogs", blogRoutes);
app.use("/blogs/:id/comments", commentRoutes);
app.use("/", indexRoutes);

app.listen(8080, function(){
    console.log("Server has started..."); 
});