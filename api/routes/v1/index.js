const express = require('express');

const paymentRoute = require('./payment.route')
const router = express.Router();

const defaultRoutes = [

  {
    path: '/payment',
    route: paymentRoute,
  },
];
defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
