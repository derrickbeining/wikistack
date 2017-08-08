'use strict';
// APP COMPONENTS
const express = require('express');
const nunjucks = require('nunjucks');
const models = require('./models');
const app = express();
const Faker = require('faker');

// MIDDLEWARE COMPONENTS
const routeRequests = require('./routes')
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path'); // provides utilities for working
                              // with file and directory paths

////////////////////////////////////////////////////////

// APP CONFIGURATION SETTINGS

app.engine('html', nunjucks.render); // set res.render (engine) to call nunjucks.render for all .html files

app.set('view engine', 'html'); // set default file ext for views so you don't have to specify every time

nunjucks.configure('views', { noCache: true }); // specify the views dir for nunjucks & disable caching

////////////////////////////////////////////////////////

// MOUNT MIDDLEWARE ONTO HTTP REQUEST HANDLER
// For each http request to '/' and its children,
// process the request buy calling all of these before anything else:

app.use('/', // root is default if not specified; included here for clarity
  morgan('dev'), // <= log http request stats to stdout
  express.static(path.join(__dirname, '/public')),
  bodyParser.urlencoded({ extended: true }), // for POST/PUT; parse the request
                                           // object and process it so that its
                                          // body data (user input) is easily
                                         //accessibly via simple dot notation.
  bodyParser.json(), // same but for for AJAX requests
  routeRequests() // send http request to routes/index.js for routing
);

////////////////////////////////////////////////////////

// SYNC DB THEN START SERVER
models.db.sync({force: true})
  .then(() => {
    Promise.all(generateRandomArticles(20))
      .then(() => {
        app.listen(1337, function () {
          console.log('listening on port 1337');
        });
      })
      .catch(console.error.bind(console));
});

function generateRandomArticles(n) {
  const articles = [];
  for (let i = 0; i < n; i++) {
    let fakeReqBody = {
      body: {
        name: Faker.name.firstName() + " " + Faker.name.lastName(),
        email: Faker.internet.email(),
        title: Faker.random.words(),
        content: Faker.lorem.paragraphs(),
        status: 'closed'
      }
    }
    articles.push(models.promiseNewPageWithAuthorId(fakeReqBody));
  }
  return articles;
}

