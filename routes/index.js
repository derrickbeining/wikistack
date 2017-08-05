'use-strict';
const express = require('express');
const router = express.Router();
const client = require('../db');


module.exports = function routeRequests() {

  router.get('/', function (req, res, next) {
    res.render('index');
    next();
  });


  return router;
}
