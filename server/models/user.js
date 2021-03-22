const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
  username: {
    type: String,
    required: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    default: '',
  },
  registeredAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
  lastLoggedIn: {
    type: Date,
    required: true,
    default: new Date(),
  },
});
mongoose.set('useCreateIndex', true);
user.index({ username: 'text' });

module.exports = mongoose.model('User', user);
