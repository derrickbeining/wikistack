const pg = require('pg');
const client = new pg.Client('postgres://localhost/twitterdb', {
  // logging: false
});

client.connect();
module.exports = client;
