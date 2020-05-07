const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;

// application configurations
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// db configurations
mongoose.connect("mongodb://localhost:27017/yelp_camp", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});
const Campground = mongoose.model("Campground", campgroundSchema);

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
      res.render("index", { campgrounds: allCampgrounds });
    }
  });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("new");
});

app.post("/campgrounds", (req, res) => {
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
  Campground.findById(req.params.id, (err, foundCampground) => {
    if(err){
      console.log(err);
    }else{
    res.render("show", { campground: foundCampground});
    }
  });
});

app.listen(PORT, () => {
  console.log("server started at localhost:" + PORT);
});
