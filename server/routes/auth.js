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
      return res.status(400).json({ message: 'User already registered with this email.' });

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

try {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your email address',
    html: `
    <p>Hello ${name},</p>
    <p>Thank you for signing up on Fundify.</p>
    <p>Your email verification code is:</p>
    <h2>${verificationCode}</h2>
    <p>Please enter this code in the app to complete your registration.</p>
    <br>
    <p>Regards,<br>Fundify Team</p>
  `
  });
  await newUser.save();  // Save only after email sent successfully
} catch (emailErr) {
  console.error("Email sending failed:", emailErr);
  return res.status(500).json({ message: "Signup failed: unable to send verification email" });
}

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

// POST /api/auth/verify
router.post('/verify', async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }
      user.verified = true;
      user.verificationCode = undefined; // Optional: clear code after use
      await user.save();

      return res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ message: 'Verification failed', error: err.message });
  }
});

// POST /api/auth/resend-code
router.post('/resend-code', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    if (user.verified)
      return res.status(400).json({ message: 'User already verified' });

    const newCode = generateCode();
    user.verificationCode = newCode;
    await user.save();

    console.log("Sending new code to:", email, "Code:", newCode);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your new verification code',
      html: `
        <p>Hello ${user.name},</p>
        <p>Here is your new verification code:</p>
        <h2>${newCode}</h2>
        <p>If you did not request this, please ignore this email.</p>
      `
    });

    res.status(200).json({ message: 'Verification code resent' });
  } catch (err) {
    console.error('Resend code error:', err);
    res.status(500).json({ message: 'Failed to resend code', error: err.message });
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
//code-verification-process
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
    user.verificationCode = code; // Optional: clear the code
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Verification failed' });
  }
});

//forget-password-email-vericiation-code
router.post('/send-verification-code-for-reset', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    // Generate and save new code
    const code = generateCode();
    user.verificationCode = code;
    await user.save();

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Verification Code',
      html: `
        <p>Hello ${user.name},</p>
        <p>Use the following code to reset your password:</p>
        <h2>${code}</h2>
        <p>If you did not request this, ignore this email.</p>
      `
    });

    res.status(200).json({ message: 'Reset code sent to email' });
  } catch (err) {
    console.error("Reset code error:", err);
    res.status(500).json({ message: 'Failed to send reset code', error: err.message });
  }
});

// POST /api/auth/resend-code-for-password-resetting
router.post('/resend-code-pr', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: 'User not found' });

   // if (user.verified)
     // return res.status(400).json({ message: 'User already verified' });

    const newCode = generateCode();
    user.verificationCode = newCode;
    await user.save();

    console.log("Sending new code to:", email, "Code:", newCode);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your new verification code',
      html: `
        <p>Hello ${user.name},</p>
        <p>Here is your new verification code:</p>
        <h2>${newCode}</h2>
        <p>If you did not request this, please ignore this email.</p>
      `
    });

    res.status(200).json({ message: 'Verification code resent' });
  } catch (err) {
    console.error('Resend code error:', err);
    res.status(500).json({ message: 'Failed to resend code', error: err.message });
  }
});

// verify the code for password reset
router.post('/verify-reset-code', async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    if (!user.verificationCode)
      return res.status(400).json({ message: 'No code found. Please resend code.' });

    if (user.verificationCode !== code.toString()) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // You can optionally clear the code now
    user.verificationCode = undefined;
    await user.save();

    return res.status(200).json({ message: 'Verification successful' });
  } catch (err) {
    console.error("Verification error:", err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});
// reset-password 
router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in DB
    user.password = hashedPassword;
    user.verificationCode = undefined; // optional: clear the reset code
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
