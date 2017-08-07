'use strict';
var express = require('express');
const router = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;

module.exports = function makeRouter() {

  router.route('/')
    .get((req, res, next) => {
      res.redirect('/');
    })
    .post((req, res, next) => {
      const body = req.body;
      const page = Page.build({
        title: body.title,
        content: body.content,
        status: body.status
      });
      page.save()
        .then((result) => {
          res.json(result);
        })
        .catch(next)
    });

  router.route('/add')
    .get((req, res, next) => {
      res.render('addpage');
    });

  router.route('/:urlTitle')
    .get((req, res, next) => {
      Page.findAll({
        where: {
          urlTitle: req.params.urlTitle
        }
      })
        .then(result => res.render('wikipage', result))
        .catch(next)
  })

  return router;
}

