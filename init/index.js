  const mongoose=require("mongoose");
 const initData=require("./data.js");
 const Listing=require("../models/listing.js");

 main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initdb=async()=>{
    await Listing.deleteMany({});
   // await Listing.insertMany(initData.data);
   for(newData of initData.data){
    const newListing = new Listing({
        title: newData.title,
        description: newData.description,
        image: newData.image, // Storing only the URL
        price: newData.price,
        location: newData.location,
        country: newData.country,
        owner: newData.owner,
    });
    
    newListing.save()
        .then(savedListing => {
            console.log("Listing saved:", savedListing);
        })
        .catch(error => {
            console.error("Error saving listing:", error);
        });
   }
    console.log("data Enter");
};

initdb();
