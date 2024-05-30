if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");
 const path=require("path");
 const methodOverride=require("method-override");
 const ejsMate = require('ejs-mate');
const ExpressError=require("./utils/ExpressError.js");
const { send } = require("process");
const listings=require("./routes/listing.js");
const userRouter=require("./routes/user.js");
const reviews=require("./routes/review.js")
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
app.use(express.json());

const data_url=process.env.ATLAS_DB_URL;
main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public"))); //for static files

const sessionOption={
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
   cookie:{                          //session use
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
   },
};

app.get("/",(req,res)=>{  //set up url
    res.send(" lisning...");
});
 
app.use(session(sessionOption));
app.use(flash());  //flash always use before routes

app.use(passport.initialize());
app.use (passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})


 
  app.use("/listings",listings);               //this is work in two part
  app.use("/listings/:id/reviews",reviews);   //common route yaha match hoga aur baki ke liye file ka path define h usme jake dekhenge
  app.use("/",userRouter);
// app.get("/testListing",async(req,res)=>{
//     let sampledata=new Listing({
//         title:"My new Vila",
//         description:"By the beach",
//         price:1200,
//         location:"Goa",
//         country:"India",
//     });
//     await sampledata.save();
//     console.log(sampledata);
//     res.send("sucessfull testing");
// });


// midleware for valdition data error
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page not Found!"))
})
app.use((err,req,res,next)=>{
  let{statusCode=500,message="somthing went wrong!"}=err;
  res.status(statusCode).render("error.ejs",{err});
});
//port define
app.listen(8080,()=>{
    console.log("server is lisen on port 8080");
}); 