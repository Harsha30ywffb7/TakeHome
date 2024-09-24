const express = require("express");
const { createContact, updateContact,getContacts, getAllContacts, deleteContact } = require("../controllers/contactController");

const contactRoutes = express.Router();

contactRoutes.get('/getcontacts',getContacts)
contactRoutes.get('/getallcontacts',getAllContacts)
contactRoutes.post("/addcontact", createContact);
contactRoutes.put("/updatecontact",updateContact);
contactRoutes.delete('/deletecontact/:id',deleteContact);

module.exports = contactRoutes;
