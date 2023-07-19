const express = require("express");
const router = require('../mainRouter');
const cors = require('cors');
const { auth } = require("../utils/authentication");
const bodyParser = require("body-parser");

exports.expressConfig=(app)=>{
  app.use(express.urlencoded({extended: true}))
  app.use(express.json())
  // app.use(bodyParser.urlencoded({extended:true}))
  // app.use(bodyParser.json())
  
  const corsMiddleware = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    next();
  };
  app.use(corsMiddleware)
  app.use(auth);
  app.use(router);
}