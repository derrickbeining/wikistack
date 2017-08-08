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
      console.log(body.name);

      User.findOrCreate({
        where: { email: body.email },
        defaults: { name: body.name }
      })  // .findOrCreate returns a Promised array [result, hadToCreate]
        .spread((user /*,created */) => { // .spread destructures array to args
          const page = Page.build({
            title: body.title,
            content: body.content,
            status: body.status
          });
          return page.save().then(page => {
            return page.setAuthor(user);
          });
        }).then(page => {
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

  return router;
}

