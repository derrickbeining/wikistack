'use strict';
var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {
 //   logging: false
});

var Page = db.define('page', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'title',
  },
  urlTitle: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  status: {
    type: Sequelize.ENUM('open', 'closed'),
    allowNull: true,
    validate: {
      notEmpty: false
    }
  }
},
  {
    getterMethods: {
      route() {
        return '/wiki/' + this.urlTitle
      }
    },
    hooks: {
      beforeValidate: (page, option) => {
        page.urlTitle = generateUrlTitle(page.title);
    }
  }
});

var User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
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
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
});

Page.belongsTo(User, { as: 'author' });
db.sync();


function generateUrlTitle (title) {
  if (title) {
    // Removes all non-alphanumeric characters from title
    // And make whitespace underscore
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w,-]/g, '');
  } else {
    // Generates random 5 letter string
    return Math.random().toString(36).substring(2, 7);
  }
}

function promiseNewPageWithAuthorId(req) {
  return User.findOrCreate({
    where: { email: req.body.email },
    defaults: { name: req.body.name }
    })  // .findOrCreate returns a Promised array [result, hadToCreate]
    .spread((user /*,created */) => { // .spread destructures array to args
      const page = Page.build({
        title: req.body.title,
        content: req.body.content,
        status: req.body.status
      });
      return page.save().then(page => {
        return page.setAuthor(user);
      });
    });
}

module.exports = {
  Page: Page,
  User: User,
  db: db,
  promiseNewPageWithAuthorId: promiseNewPageWithAuthorId
};
