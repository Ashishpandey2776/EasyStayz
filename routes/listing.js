const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const{listingSchema,reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const {islogedIn,isowner}=require("../middleware.js")
const listingConroller=require("../controller.js/listings.js")
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({storage});


router.route("/")
.get(wrapAsync(listingConroller.index)) //Index route
 .post(islogedIn,upload.single('listing[image]'), wrapAsync(listingConroller.saveListings)); //New listing save
   
//New Route
router.get("/new",islogedIn,listingConroller.renderNewForm);
//search fun
router.post("/search",listingConroller.findDesc);
//trending filter
router.post("/trending",listingConroller.trendingfilter);
  


router.route("/:id")
.get( wrapAsync(listingConroller.showListings))     //show route or read route
.put(islogedIn,isowner,upload.single('listing[image]'),wrapAsync(listingConroller.SaveChange))    //updte
.delete(islogedIn,isowner,wrapAsync(listingConroller.DeleteListing))  //delete

//edit and update route 
  router.get("/:id/edit",islogedIn,isowner,wrapAsync(listingConroller.renderEditFrom));
  
  //show route or read route
  // router.get("/:id", wrapAsync(listingConroller.showListings));
  //updte
  // router.put("/:id",islogedIn,isowner, wrapAsync(listingConroller.SaveChange));
  //delete
  // router.delete("/:id",islogedIn,isowner,wrapAsync(listingConroller.DeleteListing));
 

  module.exports=router;     //all callbacks are avl in controller
