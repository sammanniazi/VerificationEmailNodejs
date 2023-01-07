require("dotenv").config();
const jwt = require("jsonwebtoken");

const privateKey = "Authentication";

const generateAuthToken = ({ email,password,id }) =>
  jwt.sign({  email,password,id}, privateKey);

const verifyAuthToken = (token) => jwt.verify(token, privateKey);

module.exports = {
  generateAuthToken,
  verifyAuthToken,
};