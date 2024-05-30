const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const{reviewSchema}=require("../schema.js")
const ExpressError=require("../utils/ExpressError.js");
const ReviewConroller=require("../controller.js/reviews.js");
const {islogedIn,isowner}=require("../middleware.js")

  //review validation
  const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
  };

//review post route
router.post("/",validateReview,islogedIn,wrapAsync(ReviewConroller.CreateReview)
  );
  
  //review delete route
  router.delete("/:reviewID",islogedIn,isowner,wrapAsync(ReviewConroller.DeleteReview));
  
   module.exports=router;