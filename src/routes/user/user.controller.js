const express = require("express");
const { User } = require("../../models/user");
const { productitem } = require("../../models/products");
const errorHandler = require("../../middleware/error");
const { generateAuthToken } = require("../../utils/helpers");
const authHandler = require("../../middleware/auth");
const jwt = require("jsonwebtoken");

const { FormateUserObj } = require("./UserFormatter");

const cloudinary = require("../../utils/cloudinary");
const upload = require("../../utils/multer");
const nodemailer = require("nodemailer");
const Env=require("dotenv")
Env.config()

const router = express.Router();

//women bags upload

router.post("/womenbags", upload.single("image"), async (req, res) => {
  try {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Create new user
    let Product = new productitem({
      avatar: result.secure_url,

      Name: req.body.Name,
      price: req.body.price,
      quantity: req.body.quantity,
      category: req.body.category,
      description: req.body.description,

      cloudinary_id: result.public_id,
    });
    // Save user
    await Product.save();
    res.json(Product);
  } catch (err) {
    console.log(err);
  }
});

/////////signup

router.post("/signup", async (req, res) => {
  const payload = req.body;

  const checkUserEmail = await User.findOne({ email: req.body.email });
  if (checkUserEmail) {
    return res
      .status(400)
      .send({ status: false, message: "email already exist" });
  }

  let user = new User(payload);

  user = await user.save();
  const UserObj = FormateUserObj(user);
  res.status(200).send({ message: "Signup successfully!", object: UserObj });
});

//login

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).send({ message: "Invalid Email" });
  }

  if (req.body.password !== user.password) {
    return res.status(400).send({ message: "Invalid Password" });
  }

  const token = generateAuthToken({
    name: user.name,
    email: user.email,
    id: user._id,
  });

  user.token = token;

  await User.findOneAndUpdate({ _id: user._id }, { token: token });

  const UserObj = FormateUserObj(user);
  res.status(200).send({
    status: true,
    message: "Login successfully",
    token,
    data: UserObj,
  });
});

// get  all users

router.get("/allusers", async (req, res) => {
  if (req.headers.limit !== undefined) {
    const limit = req.headers.limit;
    const skip = req.headers.skip;
    const users = await User.find()
      .limit(limit)
      .skip(skip)
      .sort({ username: 1 });
    res.status(200).send(users);
  } else {
    const users = await User.find();
    res.status(200).send(users);
  }
});

//get one user

///////////////logout

router.get(
  "/logout",
  authHandler,
  errorHandler(async (req, res) => {
    const user = await User.findOne({ token: req.headers.token });
    await User.findOneAndUpdate({ _id: user._id }, { token: "" });
    res.status(200).send({
      status: true,
      message: "Logout successfully",
    });
  })
);

//////// send email

router.post("/signupemail", async (req, res) => {
  // Generate a unique token
  const token = generateToken();

  // Save the token and email to the database
  const user = new User({
    email: req.body.email,
    verificationToken: token,
  });
  // await user.save();
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 587, false for other ports
    requireTLS: true,
    auth: {
      user: process.env.email,
      pass: process.env.password,
    },
  });
  // Send the verification email
  let mailOptions = {
    from: `"Samman" <${process.env.email}>`,
    to: req.body.email,
    subject: "Email Verification",
    text: `Please click the following link to verify your email: http://example.com/verify?token=${token}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  res.send("Verification email sent");
});

router.get("/verify", async (req, res) => {
  // Look up the user with the matching token
  const user = await User.findOne({ verificationToken: req.query.token });

  if (!user) {
    return res.status(404).send("Invalid token");
  }

  // Set the verification flag to true
  user.isVerified = true;
  await user.save();

  res.send("Email verified");
});

function generateToken() {
  let token = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 8; i++) {
    token += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return token;
  // Generate a random string or hash of the user's email address
}





//edit user

router.put("/:studentId", async (req, res) => {
  console.log("body", req.body, req.params.studentId);

  try {
    const blog = await Student.findOneAndUpdate(
      { _id: req.params.studentId },
      req.body
    );
    console.log("json", blog);
    res.json({ data: blog, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

  // const id = req.params.id;
  // User.findByIdAndUpdate(id, req.body,
  //     function(err, model) {
  //         if (!err) {
  //             res.status(201).json({
  //                 data: model
  //             });
  //         } else {
  //             res.status(500).json({
  //                 message: "not found any relative data"
  //             })
  //         }
  //     });
});

/// delete user

router.delete("/:studentId", async (req, res) => {
  try {
    const blog = await Student.findByIdAndDelete(req.params.studentId);
    res.json({ data: blog, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//products routess for product table

router.get("/products", async (req, res) => {
  const payload = req.body;
  console.log(payload);
  const users = await Product.find();

  res.status(200).send(users);
});

//post students
router.post("/products", async (req, res) => {
  const payload = req.body;
  console.log(payload);
  let user = new Product(payload);

  user = await user.save();
  res.status(200).send({});
});

//edit students

router.put("/products:productId", async (req, res) => {
  console.log("body", req.body, req.params.productId);

  try {
    const blog = await Product.findOneAndUpdate(
      { _id: req.params.productId },
      req.body
    );
    console.log("json", blog);
    res.json({ data: blog, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

  // const id = req.params.id;
  // User.findByIdAndUpdate(id, req.body,
  //     function(err, model) {
  //         if (!err) {
  //             res.status(201).json({
  //                 data: model
  //             });
  //         } else {
  //             res.status(500).json({
  //                 message: "not found any relative data"
  //             })
  //         }
  //     });
});

/// delete post

router.delete("/products:productId", async (req, res) => {
  try {
    const blog = await Product.findByIdAndDelete(req.params.productId);
    res.json({ data: blog, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//get one student

router.get("/products:productId", async (req, res) => {
  try {
    const blog = await Product.findById({ _id: req.params.productId });
    res.json({ data: blog, status: "success" });
  } catch (err) {
    res.status(200).json({ error: err.message });
  }
});

module.exports = router;
