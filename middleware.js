const Listing = require("./models/listing");

module.exports.islogedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","you must login first");
        return res.redirect("/login")
     }
     next();
};

module.exports.isowner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","Permission Required to owner");
        return res.redirect(`/listings/${id}`);
    }
    next();
};