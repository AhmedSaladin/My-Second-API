const express = require('express');
const router = express.Router();
const UserController = require("../controllers/user");


// post method to creat new user 
router.post('/signup', UserController.User_SignUp);

//post method to login
router.post("/login", UserController.User_Login);

//delete method to delete exist user
router.delete("/:userId", UserController.User_Deleting);


module.exports = router