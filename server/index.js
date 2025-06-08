// server/index.js
//import dotenv from 'dotenv';
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
}).then(() => {
  console.log("MongoDB connected Successfully");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error("MongoDB connection error:", err));

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
