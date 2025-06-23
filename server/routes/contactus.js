const express = require('express');
const router = express.Router();
const Contactus = require('../models/Contactus');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, issue, subject, message } = req.body;

    const newContactus = new Contactus({
      name,
      email,
      issue,
      subject,
      message,
      status: 'New',
    });

    await newContactus.save();

    // --- Email Sending Logic ---

    // Define the full URL for the logo image
    const logoUrl = 'http://localhost:5000/Images/fundify-transparent-logo.png'; 

    // 1. User ko acknowledgment email bhejein
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Fundify: We received your problem!',
      html: `
        <p>Hello <strong>${name}</strong>,</p>
        <p>We have successfully received your problem/request regarding "${subject}".</p>
        <p>We will reach out to you as soon as possible, usually within business days.</p>
        <br>
        <p>Thank you for contacting <strong>FUNDIFY</strong>!</p>
        <p>Regards,<br>Fundify Support Team</p>
        <br>
        <img src="${logoUrl}" alt="Fundify Logo" style="width: 100px; height: auto;">
      `
    });

    // 2. Fundify support ko notification email bhejein (contact form ki details ke sath)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Yahan aap apni support team ka email address de sakte hain
      subject: `Naya Support Request: ${subject} from ${name}`,
      html: `
        <p>You have received new support request:</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Issue Type:</strong> ${issue}</li>
          <li><strong>Subject:</strong> ${subject}</li>
          <li><strong>Message:</strong><br>${message}</li>
        </ul>
        <p>Please review as soon as possible.</p>
      `
    });

    // --- End Email Sending Logic ---

    res.status(201).json({ message: 'Support request submitted successfully!', contactus: newContactus });
  } catch (err) {
    console.error('Error submitting contactus OR sending email:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.keys(err.errors).map(key => err.errors[key].message);
      return res.status(400).json({ message: 'Validation Error', errors });
    }
    res.status(500).json({ message: 'Failed to submit support request and/or send email', error: err.message });
  }
});

module.exports = router;