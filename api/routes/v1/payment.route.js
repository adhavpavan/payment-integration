const {  razorPayPayment, stripePayment, createStripePaymentIntent } = require("../../controllers/payment.controller");

const express = require('express');
const router = express.Router();


router.post('/razorpay/webhook', razorPayPayment);
router.post('/stripe/webhook',stripePayment);
router.post('/stripe/intent', createStripePaymentIntent);

module.exports = router;
