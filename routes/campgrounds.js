const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");

// Campgrounds Index
router.get("/", (req, res) => {
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

// Campgrounds New
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// Campgrounds Create
router.post("/", middleware.isLoggedIn, (req, res) => {
    let newCampground = {
        name: req.body.campName,
        image: req.body.campImage,
        description: req.body.campDescription,
        author: { id: req.user._id, username: req.user.username }
    };
    Campground.create(newCampground, (err, campground) => {
        if(err){
            console.log(err);
        }else{
            console.log("New campground inserted ...");
            console.log(campground);
        }
    });
    res.redirect("/campgrounds");
});

// Campgrounds Show
router.get("/:id", (req, res) => {
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

// Campgrounds Edit form
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id,(error, foundCampground) =>{
        res.render("campgrounds/edit", { campground: foundCampground});
    });
});

// Campground Edit logic
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Campgrounds Delete
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndDelete(req.params.id, (err) => {
       if(err){
           console.log(err);
       }
       res.redirect("/campgrounds");
    });
});

module.exports = router;
