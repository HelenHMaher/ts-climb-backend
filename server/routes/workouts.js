const express = require('express');
const router = express.Router();
const Workout = require('../models/workout.js');
const ensureAuthenticated = require('../ensureAuthenticated.js');

router.get('/singleWorkout', ensureAuthenticated, (req, res) => {
  Workout.find(
    {
      _id: req.body.workoutId,
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

// router.get('/exercisesByType', ensureAuthenticated, (req, res) => {
//   Exercise.find(
//     {
//       type: req.body.exerciseType,
//     },
//     async (err, data) => {
//       try {
//         if (err) throw err;
//         if (!data) {
//           res.status(400).json({ msg: 'No exercise found' });
//         }
//         res.status(201).json({ msg: 'Exercises found', exercise: data });
//       } catch (err) {
//         return res.status(400).json({ msg: 'Something went wrong: ', err });
//       }
//     }
//   );
// });

router.post('/newWorkout', (req, res) => {
  Workout.insertOne({
    date: req.body.date,
    name: req.body.name,
    exercises: req.body.exercises ? req.body.exercies : [],
    notes: req.body.notes ? req.body.notes : '',
  });
});

router.patch('/updateWorkout', ensureAuthenticated, (req, res) => {
  Workout.findOneAndUpdate(
    {
      _id: req.body.workoutId,
    },
    {
      $set: {
        date: req.body.date,
        name: req.body.name,
        exercises: req.body.exercises,
        notes: req.body.notes,
      },
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

// router.put('/workoutInstance', ensureAuthenticated, (req, res) => {
//   Exercise.findOneAndUpdate(
//     {
//       name: req.body.exerciseId,
//     },
//     { $set: { mostRecent: req.body.workoutId } },
//     { useFindAndModify: false },
//     async (err, data) => {
//       try {
//         if (err) throw err;
//         if (!data) {
//           res.status(400).json({ msg: 'No exercise found' });
//         }
//         res.status(201).json({ msg: 'Exercise updated' });
//       } catch (err) {
//         return res.status(400).json({ msg: 'Something went wrong: ', err });
//       }
//     }
//   );
// });

router.delete('/exercise', ensureAuthenticated, (req, res) => {
  Workout.findOneAndDelete(
    {
      _id: req.body.workoutId,
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
