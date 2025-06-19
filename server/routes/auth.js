const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();


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

// --- Google OAuth2Client Initialization ---
// IMPORTANT: Replace with your Google OAuth Client ID from Google Cloud Console
// This should preferably come from an environment variable for production.
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '656729496942-0l6989sg16pklhjupapg0pacm85jp35k.apps.googleusercontent.com'; // <<< IMPORTANT: SET THIS IN .env!
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Define your JWT secret (use a strong, random string from environment variables)
// This is used for your *application's* JWTs, not Google's.
const APP_JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_app_jwt_key_for_production'; // <<< IMPORTANT: CHANGE THIS IN PRODUCTION!


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
      APP_JWT_SECRET,  // Use APP_JWT_SECRET
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePictureUrl: user.photoURL || null // Include photoURL for frontend context
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// Google Sign-In/Sign-up Endpoint (NEW)
router.post('/google-login', async (req, res) => {
  const googleIdToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;

  if (!googleIdToken) {
    return res.status(401).json({ message: 'No Google ID token provided.' });
  }

  try {
    // 1. Verify the Google ID Token with Google's API
    console.log("Verifying Google ID token using CLIENT_ID:", GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: googleIdToken,
      audience: GOOGLE_CLIENT_ID, // Ensure the token is for your client ID
    });

    const payload = ticket.getPayload(); // Contains decoded user information
    const googleId = payload['sub']; // Google's unique user ID
    const email = payload['email'];
    const displayName = payload['name'];
    const photoURL = payload['picture'];
    const emailVerifiedByGoogle = payload['email_verified']; // Google's email verification status

    console.log('Google ID Token verified:', payload);

    // 2. Check if user exists in MongoDB based on Google ID
    let user = await User.findOne({ googleId: googleId });

    if (!user) {
        // If not found by googleId, check if an existing user with the same email exists
        // This handles cases where a user might have previously signed up with email/password
        // and now tries to sign in with Google using the same email.
        user = await User.findOne({ email: email });

        if (user) {
            // Existing user found by email, link their account to Google
            user.googleId = googleId;
            user.registrationMethod = 'google'; // Update registration method
            user.photoURL = photoURL || user.photoURL; // Update photo
            user.displayName = displayName || user.displayName; // Update display name
            // If the existing user was not verified, and Google verifies their email, mark as verified
            if (!user.verified && emailVerifiedByGoogle) {
                user.verified = true;
                user.verificationCode = undefined; // Clear any pending codes
            }
            user.lastLogin = new Date();
            await user.save();
            console.log(`Existing user linked with Google: ${email}`);
        } else {
            // New user: Create a new user in MongoDB
            user = new User({
                googleId: googleId, // Store Google's unique ID
                email: email,
                displayName: displayName,
                photoURL: photoURL,
                verified: emailVerifiedByGoogle, // Use Google's email verification status
                registrationMethod: 'google', // Mark how they registered
                createdAt: new Date(),
                lastLogin: new Date(),
            });
            await user.save();
            console.log(`New user registered via Google: ${user.email}`);
        }
    } else {
        // User exists by Google ID: Update their information
        user.email = email || user.email; // Update if email changed on Google side (unlikely)
        user.displayName = displayName || user.displayName;
        user.photoURL = photoURL || user.photoURL;
        // Ensure 'verified' status is true if Google says email is verified
        if (emailVerifiedByGoogle) {
            user.verified = true;
            user.verificationCode = undefined; // Clear any old codes if they exist
        }
        user.lastLogin = new Date();
        await user.save();
        console.log(`Existing Google user logged in: ${user.email}`);
    }


    // 3. Generate your own JWT for the frontend (for your application's authentication)
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email, googleId: user.googleId }, // Payload
      APP_JWT_SECRET,
      { expiresIn: '1d' } // Token expiration
    );

    res.status(200).json({
      message: 'Google sign-up/login successful',
      token: token,
      user: { // Send back relevant user data for frontend context
        _id: user._id,
        name: user.displayName || user.name, // Prefer Google's display name if available
        email: user.email,
        role: user.role,
        profilePictureUrl: user.photoURL // Include photoURL for frontend context
      }
    });

  } catch (error) {
    console.error('Error in Google signup/login backend endpoint:', error);
    // Specifically catch token verification errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Google ID token expired. Please try again.' });
    }
    if (error.name === 'JsonWebTokenError') { // Catch invalid signature etc.
      return res.status(401).json({ message: 'Invalid Google ID token.' });
    }
    return res.status(500).json({ message: 'Internal server error during Google sign-up/login.', error: error.message });
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
