const { query } = require("express");
const Listing=require("../models/listing.js");
const{listingSchema}=require("../schema.js");
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken:maptoken});

 module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }
  //find listing based on search
  module.exports.findDesc = async (req, res) => {
    try {
      let response = await geocodingClient.forwardGeocode({
        query: req.body.query,
        limit: 1,
      }).send();
      if (response.body.features.length === 0) {
        req.flash("error"," Plese Enter Right Place!");
        return res.redirect("/listings");
      }
      const allListings = await Listing.find({ geometry: response.body.features[0].geometry });
      if (allListings.length > 0) {
        req.flash("success"," Service in your Area!");
        res.render("listings/index.ejs", { allListings });
      } else {
        req.flash("error"," Sorry Service is not Available!");
        res.redirect("/listings");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while processing your request.");
    }
  };

  //trendingfilter
  module.exports.trendingfilter=(req,res)=>{
    const filter = req.body.filter;
    console.log(`Filter applied: ${filter}`);
    res.redirect("/listings");
 
   }

  module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
  };

  module.exports.saveListings=async (req, res,next) => {
    let response=await geocodingClient.forwardGeocode({
      query:req.body.listing.location,
      limit:1,
    }).send()

    let url=req.file.path;
    let filename=req.file.filename;
   const newdata = new Listing(req.body.listing); 
   newdata.owner=req.user._id;
   newdata.image={url,filename};
   let listingis=newdata.geometry=response.body.features[0].geometry;
   console.log(newdata);
  await newdata.save()
   req.flash("success","New Listing Created!");
   res.redirect("/listings");
};

module.exports.showListings=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("review").populate("owner");
    if(!listing){
      req.flash("error"," Listing Does't Exist!");
      res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing });
  };

  

  module.exports.renderEditFrom=async(req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error"," Listing Does't Exist!");
      res.redirect("/listings")
    }
    let originalImageurl=listing.image.url;
    originalImageurl=originalImageurl.replace("/upload","/upload/w_200");
    res.render("listings/edit", { listing,originalImageurl });
  };

  module.exports.SaveChange=async (req, res) => {
    let { id } = req.params;
    console.log(req.body.listing);
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    let response=await geocodingClient.forwardGeocode({
      query:req.body.listing.location,
      limit:1,
    }).send()

    console.log(response.body.features[0].geometry);
    if(response){
      listing.geometry=response.body.features[0].geometry;
      listing.save();
    }
     if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
     }
     req.flash("success"," Listing Updated!");
    res.redirect(`/listings/${id}`);
  };

  module.exports.DeleteListing=async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findByIdAndDelete(id);
    console.log(listing);
    req.flash("success"," Listing Delete!");
    res.redirect("/listings");
  };