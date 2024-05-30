const User=require("../models/user.js");
module.exports.signup=async(req,res)=>{
    try{
     let {username,email,password}=req.body;
     const newuser= new User({email,username});
     const registerUser=await User.register(newuser,password);
     console.log(registerUser);
     req.login(registerUser,(err)=>{
         if(err){
             return next(err);
         }
         req.flash("success","Welcome to Wanderloust!");
        res.redirect("/listings");
     }) 
    } catch(e){
     req.flash("error",e.message);
     res.redirect("/signup");
    }
 };

 module.exports.login=async(req,res)=>{
    req.flash("success","welcome to Wanderlust");
    res.redirect("/listings");
};

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    });
};