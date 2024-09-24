const express = require("express");
const {
register,
userLogin
} = require("../controllers/userController");

const userRoutes = express.Router();

userRoutes.post('/register',register);
userRoutes.post('/login',userLogin);

module.exports = userRoutes;
