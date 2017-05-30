const Todo = require('./model');
const TodoSerializer = require('./serializer');

module.exports = {
  getAll: function(req, res, next) {
    Todo.find({})
      .populate('_user', '-password')
      .then(function(data) {
        let todoJson = TodoSerializer.serialize(data);
        res.json(todoJson);
      }, function(err) {
        next(err);
      });
  },

  getOne: function(req, res, next) {
    // I use passport for handling User authentication so assume the user._id is set at this point
    Todo.findOne({'_id': req.params.id, '_user': req.user._id})
      .populate('_user', '-password')
      .then(function(todo) {
        if (!todo) {
          next(new Error('No todo item found.'));
        } else {
          let todoJson = TodoSerializer.serialize(todo);
          return res.json(todoJson);
        }
      }, function(err) {
        next(err);
      });
  },

  create: function(req, res, next) {
    // ...
  },

  update: function(req, res, next) {
    // ...
  },

  delete: function(req, res, next) {
    // ...
  }
};