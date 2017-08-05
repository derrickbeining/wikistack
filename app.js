'use strict';
const express = require('express');
const nunjucks = require('nunjucks');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path'); // provides utilities for working
                              // with file and directory paths
const app = express();

////////////////////////////////////////////////////////

// CONFIGURE APP SETTINGS
// set nunjucks.render as default res.render cbFunc for all .html files
app.engine('html', nunjucks.render);
// set default file ext for views so you don't have to specify every time
app.set('view engine', 'html');
// specify the directory for nunjucks to find views,
// & disable caching to see file updates without delay
nunjucks.configure('views', { noCache: true });

////////////////////////////////////////////////////////

// SETUP THE MIDDLEWARES
// For each http request to '/' and its children,
// process the request buy calling all of these before anything else:
app.use('/', // root is default if not specified; included here for clarity
  morgan('dev'), // <= log http request stats to stdout
  bodyParser.urlencoded({ extended: true }), // for POST/PUT; parse the request
                                           // object and process it so that its
                                          // body data (user input) is easily
                                         //accessibly via simple dot notation.
  bodyParser.json(), // for AJAX requests
  express.static(path.join(__dirname, '/public'))
);


// start the server
const server = app.listen(1337, function(){
  console.log('listening on port 1337');
});
var io = socketio.listen(server);

// modular routing that uses io inside it
app.use('/', makesRouter(io));
