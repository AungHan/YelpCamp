const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");

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
router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// Campgrounds Create
router.post("/", isLoggedIn, (req, res) => {
    let newCampground = {
        name: req.body.campName,
        image: req.body.campImage,
        description: req.body.campDescription,
        author: req.user
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

// Campgrounds Edit
router.get("/:id/edit", (req, res) => {
    Campground.findById(req.params.id, (error, foundCampground) => {
       if(error){
           res.redirect("/campgrounds");
       } else{
           res.render("campgrounds/edit", { campground: foundCampground});
       }
    });
});

router.put("/:id", (req, res) => {

});

// Campgrounds Delete
router.delete("/:id", (req, res) => {

});

// Middle Ware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;
