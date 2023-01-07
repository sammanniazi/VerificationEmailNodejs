const mongoose =require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
   
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
});

  const User = mongoose.model("users", userSchema);










const productimg = new mongoose.Schema({
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  cloudinary_id: {
    type: String,
  },
});


const imgp = mongoose.model("productimg", productimg );

module.exports={User,imgp}