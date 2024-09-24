const mongoose = require("mongoose");
const userModel = require("./userModel");

const contactSchema = new mongoose.Schema(
  {
    addedBy:{
        type:String,
        ref:userModel
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumbers: {
        type: [String], // Array of strings for phone numbers
        validate: {
          validator: function(v) {
            // Check that every phone number in the array matches the pattern
            return v.every(num => /^[0-9]{10}$/.test(num));
          },
          message: props => `${props.value} is not a valid phone number!`
        },
        required: true,
      },
      emails: {
        type: [String], // Array of strings for emails
        validate: {
          validator: function(v) {
            // Check that every email in the array matches the pattern
            return v.every(email => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email));
          },
          message: props => `${props.value} is not a valid email!`
        },
        required: true,
      },
   address:{
   type:String
   }
  },
  { timestamps: true }
);

const contactModel = mongoose.model("contacts", contactSchema);

module.exports = contactModel;
