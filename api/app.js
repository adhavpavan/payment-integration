const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const httpStatus = require('http-status');
const routes = require('./routes/v1');

const app = express();

// app.use(
//   express.raw({type: 'application/json'})
// );

// parse json request body
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.json());

// parse urlencoded request body
// app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options('*', cors());

app.listen(4005, () => {
  console.log(`Listening to port 4005`);
});


// v1 api routes
app.use('/v1', routes);


module.exports = app;
