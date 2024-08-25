const crypto = require('crypto');

function verifyWebhookSignature(secret, body, signature) {
  const expectedSignature = crypto.createHmac('sha256', secret).update(body, 'utf8').digest('hex');

  return expectedSignature === signature;
}

const razorPayPayment = async (req, res) => {
  console.log("-----------------received data from razorpay-------------------", req.body)
  const secret = 'ergfg8e65ft86wess675se'; // Replace with your actual webhook secret
  const body = JSON.stringify(req.body);
  console.log("----------data------", JSON.stringify(body))
  const signature = req.get('X-Razorpay-Signature');

  if (!verifyWebhookSignature(secret, body, signature)) {
    console.error('Webhook signature verification failed');
    return res.status(403).send('Invalid webhook signature');
  }
  console.log("--------------", body?.payload?.payment)
  res.json({ status: 'ok' })
};

const endpointSecret = "whsec_E1tJgEgMxK2Kv4irlmAuJDNJGqWho1z0";
const stripePayment = async (req, res) => {
  console.log("-----------------received data from stripe-------------------", req.body)
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    console.log(` event received ${event.type}`, event);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  res.json({ status: 'ok' })
};

const stripe = require("stripe")('sk_test_51PIiC8SHPAWrfFFlCwZEC8Nzn0dzNVzOscUXTwopNaI6eNZoPWbMoHcuvcX6LqRLfZ3NGkWG7M71Oadw06Fi1FvV00EKfT1519');
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
