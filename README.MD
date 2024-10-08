# Contacts Management Application Backend

## Problem Statement

Develop the backend for a Contacts Management Application that supports CRUD operations, contact merging, user authentication, and role-based access control.

## Objective
To create a fully functional backend API for managing contacts, which includes:

- CRUD operations for contacts.
- Merging duplicate contacts.
- Validating contact details.
- Secure authentication using JWT.
- Role-based access control for Admin and Regular Users.

## Features

### CRUD Operations:

- Create, Read, Update, and Delete contacts.
- Fields include first name, last name, email address, phone number, and address.


### Contact Merging:
- Merge duplicate contacts based on email or phone number.

### Validations:
- First Name and Last Name: Required, alphabetic.
- Email: Valid format, unique.
- Phone Number: Valid format, unique.
- Address: Optional.


### Authentication:

Secure API using JWT (JSON Web Tokens).
Role-based access control: Admins can manage all contacts; regular users can only manage their own.

### Error Handling:

Integrated error handling for proper error messages and codes.
Technologies Used
```
1. Node.js: JavaScript runtime.
2. Express.js: Web framework.
3. MongoDB: NoSQL database.
4. Mongoose: ODM for MongoDB.
5. JWT: Token-based authentication.
6. bcrypt: For password hashing.
```
Setup and Installation
Prerequisites

## Ensure you have the following installed:

- Node.js (v12+)
- MongoDB (local or MongoDB Atlas)
- Environment Variables
- Create a .env file in the root directory and add the following:

```
PORT=6000
MONGODB_URI=<Your MongoDB Connection String>
JWT_SECRET=<Your JWT Secret Key>
```


- The server will start on port 6000.


# API Endpoints
## User Routes
### 1. Register

#### POST /register

- To create a new user.

```
End point: http://localhost:6000/register


{
  "firstName": "John",
  "lastName": "Doe",
  "email": "johndoe@example.com",
  "password": "password123",
  "phoneNumber": "1234567890",
  "role": "user" // or "admin"
}

```

### 2.Login

#### POST /login

- To authenticate user and generate token.

```

End point: http://localhost:6000/login

{
  "email": "johndoe@example.com",
  "password": "password123"
}
```

# Contact Routes (Authenticated)

## Get User Contacts

#### 1. getcontacts
- Returns contacts added by the authenticated user.
```
API End point: http://localhost:6000/contact/getcontacts
```
#### 2. Get All Contacts (Admin Only)

- Admins can retrieve all contacts.
```
API Endpoint: http://localhost:6000/contact/getallcontacts
```
#### 3.Add or Merge Contact

```
End point : http://localhost:6000/contact/addcontact

sample data: 

{
  "firstName": "Jane",
  "lastName": "Doe",
  "phoneNumbers": ["1234567890"],
  "emails": ["janedoe@example.com"],
  "address": "123 Main St"
}
```

#### 4. Update Contact
- updates the specified contact
```
End point : http://localhost:6000/contact/updatecontact

{
  "contactId": "<contact_id>",
  "firstName": "Jane",
  "lastName": "Smith",
  "phoneNumbers": ["9876543210"],
  "emails": ["janesmith@example.com"],
  "address": "456 New Ave"
}
```
#### 4. Delete Contact

- Deletes the specified contact.


# Authentication

The API uses JWT for secure authentication. After a successful login, the user receives a JWT token that must be included in the Authorization header for all protected routes:

```
Authorization: Bearer <token>
```


# Models

## 1. User Model (userModel.js)

- This is the schema for user.
  
```

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  role: { type: Number, required: true } // 1 for Admin, 0 for Regular User
}, { timestamps: true });

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
```


## 2. Contact Model (contactModel.js)

- contact model to store contacts

```
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  addedBy: { type: String, ref: "User" },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumbers: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.every(num => /^[0-9]{10}$/.test(num));
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: true
  },
  emails: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.every(email => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email));
      },
      message: props => `${props.value} is not a valid email!`
    },
    required: true
  },
  address: { type: String }
}, { timestamps: true });

const contactModel = mongoose.model("Contact", contactSchema);
module.exports = contactModel;

```

# Controllers
## User Controller (userController.js)

- Handles user registration and login.

### Contact Controller (contactController.js)
- Handles CRUD operations for contacts, including merging duplicates.
- Here we write functions for routes.

# Services
## JWT Authentication (jwtAuthService.js)
- Middleware to verify JWT tokens and ensure secure access to routes.

## Error Handling (errorHandler.js)
- Centralized error handler for consistent error responses.



# Design Decisions
- Express.js: Chosen for its lightweight nature and flexibility in handling routing and middleware.
- MongoDB: Provides scalability and flexibility in managing the dynamic structure of contact details.
- JWT: Ensures secure, stateless authentication, reducing server load.
- Role-based access control: Separates responsibilities between admins and regular users, enhancing security and proper data management.
- API Documentation and Testing: Use the provided Postman collection to test API endpoints. Test individual routes, validate token-based authentication, and ensure proper functioning of CRUD operations.