const Campground = require("../models/campground");
const Comment = require("../models/comment");

const middlewareObj = {
    isLoggedIn: function (req, res, next){
                    if(req.isAuthenticated()){
                        return next();
                    }
                    req.flash("error", "Please log in first.")
                    res.redirect("/login");
    },

    checkCampgroundOwnership: function (req, res, next){
                    if(req.isAuthenticated()){
                        // does user own campground
                        Campground.findById(req.params.id,(error, foundCampground) => {
                            if(error){
                                console.log(error);
                                req.flash("error", "Campground not found!");
                                res.redirect("back");
                            } else{
                                if(foundCampground.author.id.equals(req.user._id)){
                                    //res.render("campgrounds/edit", { campground: foundCampground});
                                    next();
                                }else{
                                    req.flash("error", "You don't have access!");
                                    res.redirect("back");
                                }
                            }
                        });
                    }else{
                        req.flash("error", "You don't have access!");
                        res.redirect("back");
                    }
                },

    checkCommentOwnership: function (req, res, next){
                if(req.isAuthenticated()){
                    // does user own campground
                    Comment.findById(req.params.comment_id,(error, foundComment) => {
                        if(error){
                            console.log(error);
                            req.flash("error", "Comment not found!");
                            res.redirect("back");
                        } else{
                            if(foundComment.author.id.equals(req.user._id)){
                                //res.render("campgrounds/edit", { campground: foundCampground});
                                next();
                            }else{
                                req.flash("error", "You don't have access!");
                                res.redirect("back");
                            }
                        }
                    });
                }else{
                    req.flash("error", "You don't have access!");
                    res.redirect("back");
                }
            }
};


module.exports = middlewareObj;
