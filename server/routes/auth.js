const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,       // Your Gmail
    pass: process.env.EMAIL_PASS        // App password
  }
});

// Helper to generate 6-digit verification code
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// --- Google OAuth2Client Initialization ---
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID; // Loaded from .env
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Define your JWT secret (use a strong, random string from environment variables)
const APP_JWT_SECRET = process.env.JWT_SECRET; // Loaded from .env

// =======================================================
//                   STANDARD ROUTES
// =======================================================

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
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already registered with this email.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationCode = generateCode();

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role ,
      verified: false,
      verificationCode,
      registrationMethod: 'email' // Set registration method for traditional signup
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
      await newUser.save();
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

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 🚨 CRITICAL FIX: Explicitly select the password field because it's set to select: false in the schema.
    const user = await User.findOne({ email }).select('+password');

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    if (!user.verified)
      return res.status(401).json({ message: 'Email not verified. Please verify your email to log in.', email: user.email });

    // If the user registered via Google AND has no password set in our DB,
    // then they MUST log in with Google.
    // The `user.password` will now be available due to `.select('+password')`.
    if (user.registrationMethod === 'google' && (user.password === undefined || user.password === null)) {
      return res.status(400).json({ message: 'This account was registered with Google and no password has been set. Please log in using Google.', email: user.email });
    }

    // Now, if user.password is defined (either email signup or Google user set a password), proceed to compare.
    // If user.password is still undefined/null here, it means the condition above should have caught it.
    if (!user.password) { // Fallback check, though the above should handle it
        return res.status(400).json({ message: 'Password not set for this account. Please use Google login or set a password.', email: user.email });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      APP_JWT_SECRET,
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
        profilePictureUrl: user.profilePictureUrl || null
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// =======================================================
//         GOOGLE SIGN-IN (FOR EXISTING USERS - LOGIN PAGE)
//         Now strictly checks `user.verified` before login.
// =======================================================
router.post('/google-login', async (req, res) => {
  const googleIdToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;

  if (!googleIdToken) {
    console.error('GOOGLE_LOGIN_ERROR: No Google ID token provided in Authorization header.');
    return res.status(401).json({ message: 'Authentication failed: No Google ID token provided.' });
  }

  try {
    console.log('GOOGLE_LOGIN_STEP: Verifying Google ID Token...');
    const ticket = await client.verifyIdToken({
      idToken: googleIdToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload['sub'];
    const email = payload['email'];
    const displayName = payload['name'];
    const photoURL = payload['picture'];

    console.log('GOOGLE_LOGIN_STEP: Google ID Token verified. Payload:', payload);

    // 2. Check if user exists in MongoDB based on Google ID or email
    let user = await User.findOne({ $or: [{ googleId: googleId }, { email: email }] });

    if (!user) {
      console.log(`GOOGLE_LOGIN_STEP: No existing user found for email: ${email}. Returning "User not found".`);
      // For login endpoint, if no account is found, tell them to sign up.
      return res.status(404).json({ message: 'No account found with this Google email. Please sign up first.' });
    } else {
      console.log(`GOOGLE_LOGIN_STEP: Existing user found: ${user.email}.`);

      // Update user details if they logged in via Google (e.g., linked existing email account)
      user.googleId = googleId; // Link Google ID
      user.email = email || user.email; // Ensure email is up-to-date
      user.displayName = displayName || user.displayName || user.name;
      user.name = user.name || displayName;
      user.photoURL = photoURL || user.photoURL;
      user.registrationMethod = 'google'; // Mark as Google-linked
      user.lastLogin = new Date();

      await user.save();
      console.log('GOOGLE_LOGIN_STEP: User details updated. Now checking verification status.');

      // CRITICAL CHECK: Enforce your app's verification for login
      if (!user.verified) {
        console.log(`GOOGLE_LOGIN_STEP: User ${user.email} is NOT verified. Denying login.`);
        // Re-send verification code if they exist but are not verified.
        const newCode = generateCode();
        user.verificationCode = newCode;
        await user.save();
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'Please Verify Your Email to Log In',
          html: `<p>Hello ${user.name},</p><p>Your email is not yet verified. Here is your verification code:</p><h2>${newCode}</h2><p>Please enter this code in the app to complete your login.</p>`
        });

        return res.status(401).json({
          message: 'Email not verified. A new verification code has been sent. Please verify your email to log in.',
          email: user.email // Send email back for frontend redirection to verification page
        });
      }

      console.log('GOOGLE_LOGIN_STEP: User is verified. Generating JWT.');
      // If user is verified, generate your own JWT for the frontend
      const token = jwt.sign(
        { id: user._id, role: user.role, email: user.email, googleId: user.googleId },
        APP_JWT_SECRET,
        { expiresIn: '1d' }
      );

      console.log('GOOGLE_LOGIN_STEP: JWT generated successfully. Sending response.');
      res.status(200).json({
        message: 'Google login successful',
        token: token,
        user: {
          id: user._id,
          name: user.displayName || user.name,
          email: user.email,
          role: user.role,
          profilePictureUrl: user.photoURL
        }
      });
    }

  } catch (error) {
    console.error('GOOGLE_LOGIN_ERROR: An unexpected error occurred during Google Login:', error);
    if (error.code === 'ERR_OAUTH_TOKEN_VERIFICATION_FAILED' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Authentication failed: Invalid or expired Google ID token.' });
    }
    if (error.name === 'ValidationError') {
      console.error('GOOGLE_LOGIN_ERROR: Mongoose Validation Error:', error.message);
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: `Validation failed: ${errors.join(', ')}` });
    }
    res.status(500).json({ message: 'Internal server error during Google login.', details: error.message });
  }
});

// =======================================================
//    GOOGLE SIGN-UP (FOR NEW USERS - SIGNUP PAGE WITH EMAIL VERIFICATION)
// =======================================================
router.post('/google-signup-verify-email', async (req, res) => {
  const googleIdToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;

  if (!googleIdToken) {
    console.error('GOOGLE_SIGNUP_VERIFY_ERROR: No Google ID token provided in Authorization header.');
    return res.status(401).json({ message: 'Authentication failed: No Google ID token provided.' });
  }

  try {
    console.log('GOOGLE_SIGNUP_VERIFY_STEP: Verifying Google ID Token...');
    const ticket = await client.verifyIdToken({
      idToken: googleIdToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload['sub'];
    const email = payload['email'];
    const displayName = payload['name'];
    const photoURL = payload['picture'];
    // We are intentionally NOT using payload['email_verified'] here as we want our own verification step.

    console.log('GOOGLE_SIGNUP_VERIFY_STEP: Google ID Token verified. Payload:', payload);

    // Check if user already exists (by Google ID or email)
    let user = await User.findOne({ $or: [{ googleId: googleId }, { email: email }] });

    if (user) {
      if (user.googleId === googleId) {
        // Scenario 1: User previously tried Google sign-up and is found by googleId.
        // If they are not verified, resend the code. If they are verified, tell them to login.
        if (!user.verified) {
            const newCode = generateCode();
            user.verificationCode = newCode;
            await user.save(); // Save the new code
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Your verification code for Fundify',
                html: `<p>Hello ${displayName || email.split('@')[0]},</p><p>You are trying to sign up again. Here is your verification code:</p><h2>${newCode}</h2><p>Please enter this code to continue.</p>`
            });
            console.log('GOOGLE_SIGNUP_VERIFY_STEP: Existing unverified Google user found. New code sent.');
            return res.status(200).json({
                message: 'You already started a Google sign-up. A new verification code has been sent to your email.',
                email: email, // Return email for frontend navigation
                alreadyExists: true,
                verified: false // Indicate that user still needs verification
            });
        } else {
            // User already exists and is fully verified via Google (e.g., from LoginPage direct login).
            console.log('GOOGLE_SIGNUP_VERIFY_STEP: Existing verified Google user found. Instructing to login.');
            return res.status(400).json({ message: 'An account with this Google ID already exists and is verified. Please log in instead.' });
        }
      } else { // user exists by email, but not by googleId (i.e., different registration method)
        // Scenario 2: User exists with this email but has a different registrationMethod (e.g., traditional email/password).
        if (!user.verified) {
            console.log('GOOGLE_SIGNUP_VERIFY_STEP: Existing UNVERIFIED user found by email (different method). Linking account and resending code.');
            // Link existing unverified account to Google
            user.googleId = googleId;
            user.registrationMethod = 'google';
            user.displayName = displayName || user.displayName || user.name;
            user.photoURL = photoURL || user.photoURL;
            const newCode = generateCode();
            user.verificationCode = newCode;
            await user.save(); // Save the updated user with new Google info and new code

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Verify your email address for Fundify',
                html: `
                    <p>Hello ${displayName || user.name || email.split('@')[0]},</p>
                    <p>Your account was linked to Google. Here is your new verification code:</p>
                    <h2>${newCode}</h2>
                    <p>Please enter this code in the app to complete your registration.</p>
                    <br>
                    <p>Regards,<br>Fundify Team</p>
                `
            });
            return res.status(200).json({
                message: 'Your existing unverified account has been linked to Google. A new verification code has been sent to your email.',
                email: email, // Return email for frontend navigation
                alreadyExists: true, // Still true, but now linked
                verified: false // Still needs verification
            });
        } else {
            // Scenario 2.1: User exists with this email, is verified, and has a different registrationMethod.
            console.log('GOOGLE_SIGNUP_VERIFY_STEP: Existing VERIFIED user found by email (different method). Conflict.');
            return res.status(400).json({
                message: 'An account with this email already exists using a different sign-in method. Please log in with your existing method.',
            });
        }
      }
    }

    // Scenario 3: Brand new user. Create a new unverified user in MongoDB.
    const verificationCode = generateCode();
    user = new User({
      googleId: googleId, // Store Google's unique ID
      email: email,
      displayName: displayName, // Storing Google's display name
      name: displayName || email.split('@')[0], // Fallback name for your 'name' field
      photoURL: photoURL,
      verified: false, // Explicitly set to false for this flow (requires email verification)
      verificationCode: verificationCode, // Store the code for your verification flow
      registrationMethod: 'google', // Mark as Google signup
      createdAt: new Date(),
      lastLogin: new Date(),
      password: undefined // Google users won't have a traditional password
    });

    console.log('GOOGLE_SIGNUP_VERIFY_STEP: Creating new unverified user:', user);
    await user.save(); // Save the new user

    // Send verification email
    console.log('GOOGLE_SIGNUP_VERIFY_STEP: Sending verification email to:', email);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email address for Fundify',
      html: `
        <p>Hello ${displayName || email.split('@')[0]},</p>
        <p>Thank you for signing up on Fundify with your Google account.</p>
        <p>Your email verification code is:</p>
        <h2>${verificationCode}</h2>
        <p>Please enter this code in the app to complete your registration.</p>
        <br>
        <p>Regards,<br>Fundify Team</p>
      `
    });

    res.status(201).json({
      message: 'Google signup initiated. A verification code has been sent to your email.',
      email: email, // Return email for frontend navigation to verification page
      userId: user._id,
      emailSent: true
    });

  } catch (error) {
    console.error('GOOGLE_SIGNUP_VERIFY_ERROR: An unexpected error occurred:', error);
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError' || error.code === 'ERR_OAUTH_TOKEN_VERIFICATION_FAILED') {
      return res.status(401).json({ message: 'Authentication failed: Invalid or expired Google ID token.' });
    }
    // Catch Mongoose validation errors during user.save()
    if (error.name === 'ValidationError') {
        console.error('GOOGLE_SIGNUP_VERIFY_ERROR: Mongoose Validation Error:', error.message);
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ message: `Validation failed: ${errors.join(', ')}` });
    }
    res.status(500).json({ message: 'Internal server error during Google signup with verification.', details: error.message });
  }
});


// =======================================================
//                   CODE VERIFICATION & PASSWORD RESET ROUTES
// =======================================================

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
    user.verificationCode = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Verification failed' });
  }
});

router.post('/send-verification-code-for-reset', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    const code = generateCode();
    user.verificationCode = code;
    await user.save();

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

router.post('/resend-code-pr', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: 'User not found' });

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

    await user.save();

    return res.status(200).json({ message: 'Verification successful' });
  } catch (err) {
    console.error("Verification error:", err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.verificationCode = undefined;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ============================================================================================
// NEW: Endpoint to set password for an existing user (e.g., after Google signup verification)
// ============================================================================================
router.post('/set-password', async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!user.verified) {
      return res.status(403).json({ message: 'User email not verified. Please complete verification first.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    user.password = hashedPassword;

    if (user.registrationMethod === 'google' && user.password === undefined) {
       
        user.registrationMethod = 'google';
    }

    await user.save();

    // Optionally generate a new token for immediate login after setting password
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email, googleId: user.googleId },
      APP_JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Password set successfully. You can now log in with your email and password.',
      token,
      user: {
        id: user._id,
        name: user.displayName || user.name,
        email: user.email,
        role: user.role,
        profilePictureUrl: user.photoURL
      }
    });

  } catch (err) {
    console.error('SET_PASSWORD_ERROR: An unexpected error occurred:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: `Validation failed: ${errors.join(', ')}` });
    }
    res.status(500).json({ message: 'Internal server error while setting password.', details: err.message });
  }
});


module.exports = router;