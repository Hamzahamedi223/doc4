// userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../Controller/user.controller');

// Define routes
router.post('/signup', userController.createUser);
router.post('/signin', userController.loginUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;