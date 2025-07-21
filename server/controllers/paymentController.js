const catchAsyncErrors = require('../middleware/catchAsyncErrors');

// Make sure to configure stripe with your secret key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  // The amount is expected in the smallest currency unit (e.g., cents for USD)
  // Your frontend will likely send the amount in dollars, so we multiply by 100
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount * 100, // Convert to cents
    currency: 'pkr', // You can change this to your desired currency
    metadata: {
      company: 'Fundify',
    },
  });

  res.status(200).json({
    success: true,
    client_secret: myPayment.client_secret,
  });
});