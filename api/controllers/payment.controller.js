const crypto = require('crypto');
require('dotenv').config();

function verifyWebhookSignature(secret, body, signature) {
  const expectedSignature = crypto.createHmac('sha256', secret).update(body, 'utf8').digest('hex');

  return expectedSignature === signature;
}

const razorPayPayment = async (req, res) => {
  console.log("-----------------received data from razorpay-------------------", req.body)
  const body = JSON.stringify(req.body);
  console.log("----------data------", JSON.stringify(body))
  const signature = req.get('X-Razorpay-Signature');

  if (!verifyWebhookSignature(process.env.RAZORPAY_WEBHOOK_SECRET, body, signature)) {
    console.error('Webhook signature verification failed');
    return res.status(403).send('Invalid webhook signature');
  }
  console.log("--------------", body?.payload?.payment)
  res.json({ status: 'ok' })
};

const stripePayment = async (req, res) => {
  console.log("-----------------received data from stripe-------------------", req.body)
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, process.env.Emailid);
    console.log(` event received ${event.type}`, event);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  res.json({ status: 'ok' })
};

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const createStripePaymentIntent = async (req, res) => {
  const { amount } = req.body;
  console.log("-----------------", amount)
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    description: 'Export transaction',
    description: 'Software development services',
    shipping: {
      name: 'Jenny Rosen',
      address: {
        line1: '510 Townsend St',
        postal_code: '98140',
        city: 'San Francisco',
        state: 'CA',
        country: 'US',
      },
    },
    payment_method_types: ['card'],
  });

  console.log("-------before sending response----------", paymentIntent.client_secret)
  return res.send({
    clientSecret: paymentIntent.client_secret,
  });
}

module.exports = {
  razorPayPayment,
  stripePayment,
  createStripePaymentIntent
};
