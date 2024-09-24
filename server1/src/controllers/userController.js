const userModel= require("../models/userModel");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const secret_key = "Harsha";

//user registration
const register= async (req,res)=>{
    try{
        const salt= await bcrypt.genSalt(saltRounds);
        const userDetails= req.body;
        const hashedPassword = await bcrypt.hash(userDetails.password, salt);
        userDetails.password = hashedPassword; 
        if (isNaN(userDetails.role)) {
        return res.status(400).json({ message: "Invalid role parameter" });
      }

  //posting the data in the database
  const user = new userModel(userDetails);
  user
  .save()
  .then(() => {
    res
      .status(201)
      .json({
        message: "User Added Successfully",
        success: true,
        user: user,
      });
  })
  .catch((error) => {
    console.log(error.errmsg);
    res
      .status(400)
      .send({
        message: "User with this email already exists",
        error: error.errmsg,
      });
  });

}
    catch(error){
        res.status(500).send("Registration failed");
    }
}



// Controller function for user login
const userLogin = async (req, res) => {
  try {
    console.log(req.body);
    let { email, password } = req.body;

    // Find the user in the database by email and password
    let user = await userModel.findOne({ email });
    //console.log(user.profilePicture);
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign(
        {
          user: {
            userId: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profilePicture: user.profilePicture,
          },
        },
        secret_key,
        { expiresIn: "1d" }
      );

      const name = user.firstName + " " + user.lastName;
      // Send response with success status and token
      res.send({ success: true, token, role: user.role, name: name });
      return { token, message: "Login successful" };
    } else {
      // Send response with failure status if credentials are invalid
      res.status(400).send({ message: "Invalid credentials", success: false });
      throw new Error("Invalid password or email");
    }
  } catch (err) {
    console.error("Error during login:", err.message);
    // Send response with server error status
    res.status(500).send(err);
    throw new Error("Error during login: " + err.message);
  }
};

module.exports = { register,userLogin };
