const mongoose =require("mongoose");



const userproduct= new mongoose.Schema({
    avatar: {
        type: String,
      },
  Name: {
    type: String,
  },
  
  price: {
    type: String,
  },
  quantity: {
    type: String,
  },
  category: {
    type: String,
  },
  description: {
    type: String,
  },
  
  

  cloudinary_id: {
    type: String,
  },
});


const productitem = mongoose.model("userproduct", userproduct);

module.exports={productitem}