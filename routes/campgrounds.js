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
router.get("/:id/edit", checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id,(error, foundCampground) =>{
        res.render("campgrounds/edit", { campground: foundCampground});
    });
});

// Campground Edit logic
router.put("/:id", checkCampgroundOwnership, (req, res) => {
    if(req.isAuthenticated()){
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
            if(err){
                console.log(err);
                res.redirect("/campgrounds");
            }else{
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    }else{

    }
});

// Campgrounds Delete
router.delete("/:id", checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndDelete(req.params.id, (err) => {
       if(err){
           console.log(err);
       }
       res.redirect("/campgrounds");
    });
});

// Middle Ware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        // does user own campground
        Campground.findById(req.params.id,(error, foundCampground) => {
            if(error){
                console.log(error);
                res.redirect("back");
            } else{
                if(foundCampground.author.id.equals(req.user._id)){
                    //res.render("campgrounds/edit", { campground: foundCampground});
                    next();
                }else{
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }
}

module.exports = router;
