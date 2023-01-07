const express=require("express");
const mongoose =require("mongoose");

const router=require("./routes/user/user.controller");
const authHandler = require("./middleware/auth");
var cors = require('cors')







const app=express();
app.use(cors())


app.use(express.json());

mongoose .connect("mongodb://127.0.0.1:27017/Easyshop")
.then(()=>console.log("connected to mongodb"))
 .then(()=>console.log())
 .catch((error)=>console.log(`Couldn't connected to MongoDB, ${error}`));


 


 app.use("/users",router)

 app.use("/products",router)





  app.listen(5000, () => console.log("App is listening at port 5000"));





