const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoutes = require("./src/routes/userRoute");
const contactRoutes = require("./src/routes/contactRoutes");

const { verifyJwt } = require("./src/services/jwtAuthService"); // Destructure the verifyJwt function from jwtAuthService
const errorHandler = require("./src/services/errorHandler");


const app = express();

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());
app.use(bodyParser.json());
app.use('/', userRoutes);

app.use('/contact',verifyJwt,contactRoutes);
app.use(errorHandler);

const uri = "mongodb+srv://harsha30ywffb7:fYhIkZBbXLJsTNQC@harshaproject.m9sxh.mongodb.net/?retryWrites=true&w=majority&appName=HarshaProject";
mongoose.connect(uri)
  .then(() => {
    console.log('DB Connected');
    app.listen(6000, () => {
      console.log('Server started on port 6000');
    });
  })
  .catch((e) => {
    console.log(e);
  });
