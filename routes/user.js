'use strict';
var express = require('express');
const router = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;

router.route('/')
  .get((req, res, next) => {
    User.findAll({})
      .then(users => {
        res.render('users', { users: users });
      })
      .catch(next);
  });

module.exports = () => router;
