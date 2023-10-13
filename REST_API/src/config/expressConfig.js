const express = require("express");
const router = require('../mainRouter');
const cors = require('cors');
const { auth } = require("../utils/authentication");
const bodyParser = require("body-parser");

exports.expressConfig = (app) => {
  // app.use("paymentMade",express.raw({ type: 'application/json' }))

  //
  // app.use(bodyParser.raw({ type: 'application/json' }));
  // app.use(bodyParser.urlencoded({extended:true}))
  // app.use(bodyParser.json())

  const allowedOrigins = ['http://localhost:4200', 'https://viktorshandrov.github.io'];
  const corsMiddleware = (req, res, next) => {

    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', allowedOrigins); // Allow requests from your Angular app
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      next();
    });
  }
  // app.use(corsMiddleware)
  app.use(cors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // This allows cookies and authorization headers
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization', // Add the allowed headers here
  }));

  app.use(auth);
  app.use(router);
}