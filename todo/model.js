const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let todoSchema = new Schema({
  title: {
    type: String
  },

  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Todo', todoSchema);