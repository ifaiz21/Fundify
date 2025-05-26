const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,      // Your Gmail
    pass: process.env.EMAIL_PASS       // App password
  }
});

// Helper to generate 6-digit verification code
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

router.get('/test-email', async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // send to your own email
      subject: 'Test Email from Fundify App',
      html: `<p>This is a test email to confirm Nodemailer is working properly.</p>`
    });

    res.status(200).json({ message: 'Test email sent successfully!' });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ message: 'Failed to send test email', error: error.message });
  }
});


router.post('/sign-up', async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log("Signup request body:", req.body);

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification code
    const verificationCode = generateCode();

    // Save user with 'verified: false' and the code
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role ,
      verified: false,
      verificationCode
    });

    await newUser.save();

    // Send verification email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email address',
      html: `
        <p>Hello ${name},</p>
        <p>Thank you for signing up. Please use the following code to verify your email address:</p>
        <h2>${verificationCode}</h2>
        <p>This code will expire soon.</p>
      `
    });

    res.status(201).json({
      message: 'Verification code sent to email',
      emailSent: true,
      userId: newUser._id
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    if (!user.verified)
      return res.status(401).json({ message: 'Email not verified' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

router.post('/code-verification', async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    if (user.verified)
      return res.status(400).json({ message: 'User already verified' });

    if (user.verificationCode !== code)
      return res.status(400).json({ message: 'Invalid verification code' });

    user.verified = true;
    user.verificationCode = undefined; // Optional: clear the code
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Verification failed' });
  }
});


module.exports = router;
