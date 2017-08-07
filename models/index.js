'use strict';
const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/wikistack');

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    validate: {
      notNull: true,
      isAlpha: true,
      notEmpty: true,
      isFirstAndLastName: function (value) {
        const numOfNames = value.split(' ').length;
        if (numOfNames < 2) {
          throw new Error('Must provide first and last name.');
        }
      }
    }
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    }
  }
});

const Page = db.define('page', {
  title: {
    type: Sequelize.STRING,
    validate: {
      notNull: true,
      notEmpty: true,
      len: [1, 30]
    }
  },
  urlTitle: {
    type: Sequelize.STRING,
    validate: {
      isUrl: true
    }
  },
  content: {
    type: Sequelize.TEXT,
    validate: {
      notEmpty: true,
      notNull: true
    }
  },
  status: {
    type: Sequelize.ENUM('open', 'closed')
  }
},
  {
    getterMethods: {
      route() {
        return '/wiki/' + this.urlTitle;
      }
    }
});

module.exports = {
  db: db,
  Page: Page,
  User: User
}
