const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exercise = new Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: Number,
    required: true,
  },
  createdOn: {
    type: Date,
    required: true,
    default: new Date(),
  },
  lastUpdated: {
    type: Date,
    default: new Date(),
  },
  workouts: {
    type: Array,
    required: true,
    default: [],
  },
});

module.exports = mongoose.model('Exercise', exercise);
