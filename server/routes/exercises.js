const express = require('express');
const router = express.Router();
const Exercise = require('../models/exercise.js');
const ensureAuthenticated = require('../ensureAuthenticated.js');

router.get('/singleExercise', ensureAuthenticated, (req, res) => {
  Exercise.find(
    {
      name: req.body.name,
    },
    async (err, data) => {
      try {
        if (err) throw err;
        if (!data) {
          res.status(400).json({ msg: 'No exercise found' });
        }
        res.status(201).json({ msg: 'Exercise found', exercise: data });
      } catch (err) {
        return res.status(400).json({ msg: 'Something went wrong: ', err });
      }
    }
  );
});

router.get('/allExercises', ensureAuthenticated, (req, res) => {
  Exercise.find({}, async (err, data) => {
    try {
      if (err) throw err;
      if (!data) {
        res.status(400).json({ msg: 'No exercises found' });
      }
      res.status(201).json({ msg: 'All exercises', exercises: data });
    } catch (err) {
      return res.status(400).json({ msg: 'Something went wrong: ', err });
    }
  });
});

router.get('/exercisesByType/:type', ensureAuthenticated, (req, res) => {
  Exercise.find(
    {
      type: req.params.type,
    },
    async (err, data) => {
      try {
        if (err) throw err;
        if (!data) {
          res.status(400).json({ msg: 'No exercise found' });
        }
        res.status(201).json({ msg: 'Exercises found', exercises: data });
      } catch (err) {
        return res.status(400).json({ msg: 'Something went wrong: ', err });
      }
    }
  );
});

router.post('/newExercise', (req, res) => {
  Exercise.findOne({ name: req.body.name }, async (err, doc) => {
    try {
      if (err) {
        return res
          .status(400)
          .json({ msg: 'Sorry something went wrong: ', err });
      }
      if (doc) return res.status(400).json({ msg: 'Exercise Already Exists (choose different name)' });

      const newExercise = new Exercise({
        name: req.body.name,
        description: req.body.description || '',
        type: req.body.type,
      });
      await newExercise.save();
      res.status(201).json({ msg: 'Exercise Created' });
    } catch (error) {
      return res.status(400).json({
        msg: 'Something went wrong: ', err,
      });
    }
  });
});

router.patch('/updateExercise', ensureAuthenticated, (req, res) => {
  Exercise.findOne({name: req.body.name}, async (err, doc) => {
    try {
      if (err) {
        return res.status(400).json({msg: 'sorry something when wrong: ', err});
      }
      if (doc) return res.status(400).json({msg: 'Exercise Already Exists (choose a different name)'});
      Exercise.findOneAndUpdate(
        {
          _id: req.body._id,
        },
        {
          $set: {
            name: req.body.name,
            description: req.body.description,
            type: req.body.type,
            lastUpdated: new Date(),
          },
        },
        { useFindAndModify: false },
        async (err, data) => {
          try {
            if (err) throw err;
            if (!data) {
              res.status(400).json({ msg: 'No exercise found' });
            }
            res.status(201).json({ msg: 'Exercise updated' });
          } catch (err) {
            return res.status(400).json({ msg: 'Something went wrong: ', err });
          }
        }
      );
      } catch (err) {
        return res.status(400).json({msg: 'Something when wrong: ', err});
      }
  });
});


// router.put('/exerciseInstance', ensureAuthenticated, (req, res) => {
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

router.delete('/deleteExercise', ensureAuthenticated, (req, res) => {
  Exercise.findOneAndDelete(
    {
      _id: req.body._id,
    },
    async (err, data) => {
      try {
        if (err) throw err;
        if (!data) {
          res.status(400).json({ msg: 'No exercise found' });
        }
        res.status(201).json({ msg: 'Exercise deleted' });
      } catch (err) {
        return res.status(400).json({ msg: 'Something went wrong: ', err });
      }
    }
  );
});

module.exports = router;
