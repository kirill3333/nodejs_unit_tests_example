'use strict';

const JSONAPISerializer = require('jsonapi-serializer').Serializer;

module.exports = new JSONAPISerializer('todos', {
  attributes: ['title', '_user']
  ,
  _user: {
    ref: 'id',
    attributes: ['username']
  }
});