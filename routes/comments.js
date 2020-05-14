const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

// Comment New
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err);
        }    else{
            res.render("comments/new", { campground: campground });
        }
    });
});

// Comment Create
router.post("/", middleware.isLoggedIn, (req, res) => {
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
                    // add username and id to comment
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    // save comment
                    campground.comments.push(newComment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// Comment Edit Get
router.get("/:comment_id/edit", middleware.checkCommentOwnership,  (req, res) => {
    Comment.findById(req.params.comment_id, (error, foundComment) => {
        res.render("comments/edit", { campground_id: req.params.id, comment: foundComment});
    });
});

// Comment Edit Logic
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (error, updatedComment) => {
       if(error){
           console.log(error);
       }
       res.redirect("/campgrounds/" + req.params.id);
   });
});

// Comment Delete
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
   Comment.findByIdAndDelete(req.params.comment_id, (error) => {
       if(error){
           console.log(error);
       }
       res.redirect("/campgrounds/" + req.params.id);
   })
});



module.exports = router;
