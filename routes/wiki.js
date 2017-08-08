'use strict';
var express = require('express');
const router = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;

// ROUTER EXPORTED AT BOTTOM

router.route('/')
  .get((req, res, next) => {
    res.redirect('/');
  })
  .post((req, res, next) => {
    models.promiseNewPageWithAuthorId(req)
    .then(page => {
      res.redirect(page.route);
    })
    .catch(next);
  });

router.route('/add')
  .get((req, res, next) => {
    res.render('addpage');
  });

router.route('/:urlTitle')
  .get((req, res, next) => {
    Page.find({
      where: {
        urlTitle: req.params.urlTitle
      }
    })
      .then(page => res.render('wikipage', {page: page}))
      .catch(next)
})



module.exports = () => router;

