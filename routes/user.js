const express=require("express");
const wrapAsync = require("../utils/wrapAsync");
const router=express.Router();
const passport = require("passport");
const UserConroller=require("../controller.js/users.js");

//signup
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(UserConroller.signup));

//login
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",passport.authenticate("local",{failureRedirect:"/login", failureFlash:true}),UserConroller.login);

//for logout
router.get("/logout",UserConroller.logout);



module.exports=router;