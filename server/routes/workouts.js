const express = require('express');
const uniquid = require('uniqid');
const router = express.Router();
const Workout = require('../models/workout.js');
const ensureAuthenticated = require('../ensureAuthenticated.js');

router.get('/singleWorkout/:id', ensureAuthenticated, (req, res) => {
  Workout.find(
    {
      _id: req.params.id,
    },
    async (err, data) => {
      try {
        if (err) throw err;
        if (!data) {
          res.status(400).json({ msg: 'No workout found' });
        }
        res.status(201).json({ msg: 'Workout found', workout: data });
      } catch (err) {
        return res.status(400).json({ msg: 'Something went wrong: ', err });
      }
    }
  );
});

router.get('/allWorkouts', ensureAuthenticated, (req, res) => {
  Workout.find({}, async (err, data) => {
    try {
      if (err) throw err;
      if (!data) {
        res.status(400).json({ msg: 'No workouts found' });
      }
      res.status(201).json({ msg: 'All workouts', workouts: data });
    } catch (err) {
      return res.status(400).json({ msg: 'Something went wrong: ', err });
    }
  });
});

router.post('/newWorkout', ensureAuthenticated, async (req, res) => {
  try {
    const exerciseObjects = req.body.exercises.map(x => {return { id: x, instanceId: uniquid() }});
    const name = req.body.name.length > 1 ? req.body.name : "unknown"
    const notes = req.body.notes.length > 1 ? req.body.notes : "no notes"
    const newWorkout = new Workout({
      date: req.body.date,
      name: name,
      exercises: exerciseObjects,
      notes: notes,
    });
    await newWorkout.save();
    res.status(201).json({msg: 'Workout Created'});
  }
  catch {
    return res.status(400).json({msg: 'Something went wrong: ', err})
  }
});

router.patch('/updateWorkout', ensureAuthenticated, (req, res) => {
  const exerciseObjects = req.body.exercises.map(x => {return { id: x, instanceId: uniquid() }})
  Workout.findOneAndUpdate(
    {
      _id: req.body._id,
    },
    {
      $set: {
        date: req.body.date,
        name: req.body.name,
        notes: req.body.notes,
      },
      $push: {
        exercises: exerciseObjects
      }
    },
    { useFindAndModify: false },
    async (err, data) => {
      try {
        if (err) throw err;
        if (!data) {
          res.status(400).json({ msg: 'No workout found' });
        }
        res.status(201).json({ msg: 'Workout updated' });
      } catch (err) {
        return res.status(400).json({ msg: 'Something went wrong: ', err });
      }
    }
  );
});


router.delete('/deleteWorkout', ensureAuthenticated, (req, res) => {
  Workout.findOneAndDelete(
    {
      _id: req.body._id,
    },
    async (err, data) => {
      try {
        if (err) throw err;
        if (!data) {
          res.status(400).json({ msg: 'No workout found' });
        }
        res.status(201).json({ msg: 'Workout deleted' });
      } catch (err) {
        return res.status(400).json({ msg: 'Something went wrong: ', err });
      }
    }
  );
});

module.exports = router;
