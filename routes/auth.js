const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   GET /register
// @desc    Get registration page
// @access  Public
router.get('/register', authController.getRegisterPage);

// @route   GET /login
// @desc    Get login page
// @access  Public
router.get('/login', authController.getLoginPage);

// @route   POST /register
// @desc    Register user
// @access  Public
router.post('/register', authController.register);

// @route   POST /login
// @desc    Login user
// @access  Public
router.post('/login', authController.login);

// @route   GET /logout
// @desc    Logout user
// @access  Public
router.get('/logout', authController.logout);

module.exports = router;
