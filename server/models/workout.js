const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workout = new Schema({
  date: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    index: true,
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
  lastUpdated: {
    type: Date,
    default: new Date(),
  }
});
mongoose.set('useCreateIndex', true);
workout.index({ name: 'text' });

module.exports = mongoose.model('Workout', workout);
