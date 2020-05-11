const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const seedDb = require("./seed");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalStrategy = require("passport-local-mongoose");
const User = require("./models/user");
const app = express();

const PORT = 3000;
//seedDb();

// db configurations
mongoose.connect("mongodb://localhost:27017/yelp_camp", {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

// application configurations
app.set("view engine", "ejs");
app.use(require("express-session")({
    secret: "yelppy",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware
app.use((req, res, next) => {
   res.locals.currentUser = req.user;
   next();
});

// Routings
app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/campgrounds", (req, res) => {
    // Get campgrounds from db
    Campground.find({}, (err, allCampgrounds) => {
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {
                campgrounds: allCampgrounds,
                currentUser: req.user
            });
        }
    });
});

app.get("/campgrounds/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

app.post("/campgrounds", isLoggedIn, (req, res) => {
    Campground.create({
        name: req.body.campName,
        image: req.body.campImage,
        description: req.body.campDescription
    }, (err, campground) => {
        if(err){
            console.log(err);
        }else{
            console.log("New campground inserted ...");
            console.log(campground);
        }
    });
    res.redirect("/campgrounds");
});

app.get("/campgrounds/:id", (req, res) => {
    // find campground with provided id
    Campground.findById(req.params.id)
        .populate("comments")
        .exec((err, foundCampground) => {
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show", { campground: foundCampground});
        }
    });
});

// ======================
// COMMENTS ROUTES
// ======================

app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
        }    else{
            res.render("comments/new", { campground: campground });
        }
    });

});

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else{
           // create new comment
           Comment.create(req.body.comment, (err, newComment) => {
               if(err){
                   console.log(err);
               }else{
                   campground.comments.push(newComment);
                   campground.save();
                   res.redirect("/campgrounds/" + campground._id);
               }
           });
       }
    });
});

// AUTH ROUTE
app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    User.register(new User({ username: req.body.username }),
        req.body.password,
        (err, user) => {
            if(err){
                console.log(err);
                return res.redirect("/register");
            }
            passport.authenticate("local")(req, res, () => {
                res.redirect("/campgrounds");
            });
        });
});

// show log in form
app.get("/login", (req, res) => {
   res.render("login");
});

app.post("/login",
    passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),
    (req, res) => {

});

// logout
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/campgrounds");
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(PORT, () => {
    console.log("server started at localhost:" + PORT);
});
