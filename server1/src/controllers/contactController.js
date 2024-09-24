const contactModel= require('../models/contactModel');
const userModel = require("../models/userModel");
//admin can perform crud on  any number of contact details, regular user can perform crud on only his details


// add contact details, 
// Create contact or update existing one by merging phone numbers and emails
const createContact = async (req, res) => {
  try {
    const { userId, role } = req.user.user;
    let contactDetails = {};

    if (role === 1) { // Admin role
      const { firstName, lastName, phoneNumbers, emails, address } = req.body;

      // Check if contact with same first and last name already exists
      let existingContact = await contactModel.findOne({ firstName, lastName });

      if (existingContact) {
        // Merge phone numbers and emails without duplicates
        existingContact.phoneNumbers = [
          ...new Set([...existingContact.phoneNumbers, ...phoneNumbers])
        ]; // Using Set to avoid duplicate phone numbers

        existingContact.emails = [
          ...new Set([...existingContact.emails, ...emails])
        ]; // Using Set to avoid duplicate emails

        // Update the address if provided
        if (address) existingContact.address = address;

        // Save the updated contact
        await existingContact.save();
        res.status(200).json({
          message: "Contact updated successfully",
          contact: existingContact
        });
      } else {
        // If contact doesn't exist, create a new one
        contactDetails = {
          addedBy: userId,
          firstName,
          lastName,
          phoneNumbers,
          emails,
          address,
        };

        const newContact = new contactModel(contactDetails);
        await newContact.save();
        res.status(201).json({
          message: "Contact added successfully",
          contact: newContact
        });
      }
    } else {
      // Logic for non-admin users (if applicable)
      // Normal user can only add their own contact details or specific logic for them
      const checkUser = await contactModel.findOne({ addedBy: userId });
      if(req.body.firstName !== req.user.user.firstName && req.body.lastName !== req.user.user.lastName)
      {
return res.status(404).json("You cannot add other's contact details")
      }
      if (!checkUser) {
        contactDetails = {
          addedBy: userId,
          firstName: req.user.user.firstName,
          lastName: req.user.user.lastName,
          phoneNumbers: req.body.phoneNumbers,
          emails: req.body.emails,
          address: req.body.address
        };

        const contact = new contactModel(contactDetails);
        await contact.save();
        res.status(201).json({
          message: "Contact details added successfully",
          contact: contact
        });
      } else {
        // Handle merging for regular users if needed (same as admin logic, or restricted)
        checkUser.phoneNumbers = [
          ...new Set([...checkUser.phoneNumbers, ...req.body.phoneNumbers])
        ];

        checkUser.emails = [
          ...new Set([...checkUser.emails, ...req.body.emails])
        ];

        if (req.body.address) checkUser.address = req.body.address;

        await checkUser.save();
        res.status(200).json({
          message: "Contact updated successfully",
          contact: checkUser
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "Error inserting contact details",
      error: error.message
    });
  }
};





//update contact details
const updateContact = async(req,res)=>{
try{
const userId= req.user.user.userId;
console.log(userId);
const user = await contactModel.findOne({_id:req.body._id},'addedBy');
console.log(user.addedBy);
if(userId !== user.addedBy)
{
   return res.status(404).json("Not a valid user to update this");
}
const update = await contactModel.findByIdAndUpdate(
    req.body._id,               // _id is used directly as the identifier
    { $set: req.body },          // $set updates the fields provided in req.body
    { new: true }                // Return the updated document
  );
  res.send({ message: "Contact updated successfully", user: update });
} catch (error) {
  res
    .status(500)
    .send({ message: "Error updating contact", error: error.message });
}
}


  //delete contact
  const deleteContact = async (req,res) => {
      try{
  const id=req.params.id;
  const userId= req.user.user.userId;
  // console.log(userId);
  const user = await contactModel.findOne({_id:id},'addedBy');
  // console.log(user.addedBy);
  if(userId !== user.addedBy)
  {
     return res.status(404).json("You cannot delete this contact");
  }
  const deleted = await contactModel.findByIdAndDelete(id);
  if(!deleted){
      return res.status(404).send("Contact not found");
  }
  return res.status(200).send("Contact deleted successfully");
      }
      catch(error){
          return res.status(500).send("Failed to delete the record");
      }
  }
  
  //get all contacts
  const getAllContacts = async (req,res)=> {
  try{
  const contacts= await contactModel.find();
  if(contacts.length===0){
      return res.status(404).json("Contact list is empty");
  }
  res.status(200).json(contacts);
  }
  catch(error){
      res.status(500).json("Error fetching contacts");
  }
  }
  
  //get contacts which are added by that particular user
  const getContacts = async (req,res)=> {
      try{
          const userId= req.user.user.userId;
      const contacts= await contactModel.find({addedBy:userId});
      if(contacts.length===0){
          return res.status(404).json("Contact list of this user is empty");
      }
      res.status(200).json(contacts);
      }
      catch(error){
          res.status(500).json("Error fetching contacts");
      }
      }

module.exports = {
  createContact,updateContact,deleteContact, getContacts, getAllContacts
};


  
