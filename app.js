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
const campgroundsRoutes = require("./routes/campgrounds");
const commentRoutes = require("./routes/comments");
const authRoutes = require("./routes/index");
const methodOverride = require("method-override");
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
app.use(methodOverride("_method"));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware
app.use((req, res, next) => {
   res.locals.currentUser = req.user;
   next();
});

app.use("/", authRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(PORT, () => {
    console.log("server started at localhost:" + PORT);
});
