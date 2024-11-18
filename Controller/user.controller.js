// userController.js
const User = require('../Models/user.model'); // Import the User model
const bcrypt = require('bcryptjs')
require('dotenv').config(); // Load environment variables
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; // Access secret key
// Create a new user
const createUser = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;
        // Hash the password
        const salt = await bcrypt.genSalt(10); // Generate a salt
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password
    // You should hash the password here before saving (e.g., using bcrypt)
    const newUser = new User({
      username,
      password : hashedPassword, // Hash this before saving
      email,
      firstName,
      lastName,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ message: 'Error creating user', error });
  }
};
//loginUser
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a token
    const token = jwt.sign(
      { id: user._id, email: user.email},
      JWT_SECRET, // Use the secret key from environment variables
      { expiresIn: '1h' } // Token expiration time
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: user
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ message: 'Error retrieving users', error });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ message: 'Error retrieving user', error });
  }
};

// Update user information
const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run validation on update
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json({ message: 'Error updating user', error });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

// Export all controller functions
module.exports = {
  loginUser,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
