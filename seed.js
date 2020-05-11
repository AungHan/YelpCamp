const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

const data = [
    {
        name: "Cloud's Rest",
        image: "https://pixabay.com/get/52e3d5404957a514f1dc84609620367d1c3ed9e04e5074417c2f78dc924ac2_340.jpg",
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."
    },
    {
        name: "Morning pot",
        image: "https://pixabay.com/get/50e9d4474856b10ff3d8992ccf2934771438dbf852547940752c73d1904a_340.jpg",
        description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32."
    },
    {
        name: "Flourish",
        image: "https://pixabay.com/get/52e3d3404a55af14f1dc84609620367d1c3ed9e04e5074417c2f78dc924ac2_340.png",
        description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
    }
];

function seedDB(){
    // removed all campgrounds
    Campground.deleteMany({}, function(err){
       if(err){
           console.log(err);
       }
       console.log("removed campground!");
        // add some campgrounds
        // data.forEach(seed => {
        //     Campground.create(seed, (err, newOne) => {
        //         if(err){
        //             console.log(err);
        //         }else{
        //             Comment.create({
        //                 text: "I think therefore I am!",
        //                 author: "Elon Musk"
        //             }, (err, newComment) => {
        //                 if(err){
        //                     console.log(err);
        //                 }else{
        //                     newOne.comments.push(newComment);
        //                     newOne.save();
        //                 }
        //             });
        //         }
        //     });
        // });
    });

}

module.exports = seedDB;
