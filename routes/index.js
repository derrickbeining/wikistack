'use-strict';
const express = require('express');
const router = express.Router();
// const client = require('../db');
const wikiRouter = require('./wiki');
const userRouter = require('./user')


module.exports = function makeRouter() {
  router.use('/wiki', wikiRouter());
  router.use('/user', userRouter());
  router.get('/', function (req, res, next) {
    res.render('index');
  });

  return router
}
