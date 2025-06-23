// server/controllers/newsletterController.js
const NewsletterSubscription = require('../models/NewsletterSubscription');
const nodemailer = require('nodemailer'); // Import nodemailer
// require('dotenv').config(); // <-- REMOVE THIS LINE, as it's now in index.js

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Optional: For local development or if your SMTP server uses a self-signed certificate
  // tls: {
  //   rejectUnauthorized: false
  // }
});

exports.subscribeToNewsletter = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required for subscription.' });
  }

  try {
    const existingSubscription = await NewsletterSubscription.findOne({ email });

    if (existingSubscription) {
      return res.status(409).json({ message: 'This email is already subscribed to the newsletter.' });
    }

    const newSubscription = new NewsletterSubscription({ email });
    await newSubscription.save();

    // --- Send Email to Admin ---
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL, // Admin's email address from .env
      subject: 'New Newsletter Subscription on Fundify',
      html: `
        <p>Hello Admin,</p>
        <p>This user has been successfully subscribed to the newsletter:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>Thank you.</p>
      `,
    };

    // --- Send Email to User ---
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email, // The newly subscribed user's email
      subject: 'Welcome to Fundify Newsletter!',
      html: `
        <p>Hello,</p>
        <p>You have successfully subscribed for the latest news on Fundify. We're excited to share updates, success stories, and impactful projects directly to your inbox.</p>
        <p>Thank you for joining our community!</p>
        <p>Best regards,<br/>The Fundify Team</p>
      `,
    };

    // Diagnostic logs: Check the recipient emails before sending
    console.log('Attempting to send emails:');
    console.log('Admin recipient:', adminMailOptions.to);
    console.log('User recipient:', userMailOptions.to);

    // Send both emails concurrently
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions)
    ]);

    res.status(201).json({ message: 'Successfully subscribed to the newsletter! Confirmation email sent.' });

  } catch (error) {
    console.error('Error subscribing to newsletter or sending email:', error);
    if (error.code === 11000) {
      return res.status(409).json({ message: 'This email is already subscribed to the newsletter.' });
    }
    res.status(500).json({ message: 'Server error during subscription or email sending.', error: error.message });
  }
};