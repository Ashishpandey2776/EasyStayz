const Listing=require("../models/listing.js");
const Review=require("../models/review.js")

 module.exports.CreateReview=async(req,res)=>{
    console.log(req.params.id);
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
     listing.review.push(newReview);
     await newReview.save();
     await listing.save();
     console.log("review save succefull");
     req.flash("success","Thank You For Your feedback!");
     res.redirect(`/listings/${listing._id}`);  
  };

  module.exports.DeleteReview=async(req,res)=>{
    let {id,reviewID}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewID}});//pull use to delete data from review arr using their id
    await Review.findByIdAndDelete(reviewID);
    if(!reviewID){
      req.flash("error"," Review Does't Exist!");
      res.redirect("/listings")
    }
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`)
   };