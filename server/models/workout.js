const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workout = new Schema({
  date: {
    type: Date,
    required: true,
    default: new Date(),
  },
  name: {
    type: String,
    required: true,
  },
  exercises: {
    type: Array,
    required: true,
  },
  notes: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

module.exports = mongoose.model('Workout', workout);
