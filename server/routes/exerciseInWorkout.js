const express = require('express');
const uniquid = require('uniqid');
const router = express.Router();
const Workout = require('../models/workout.js');
const ensureAuthenticated = require('../ensureAuthenticated.js');

//update exerciseInWorkout

router.patch('/updateExerciseInWorkout', ensureAuthenticated, async (req, res) => {
    Workout.findOne(
        {
            _id: req.body.workoutId
        },
        async (err, data) => {
            try {
                if (err) {
                    res.status(400).json( { msg: 'Something went wrong: ', err } )
                }
                if (!data) {
                    res.status(404).json({ msg: 'No workout found' })
                }
                const updatedExercises = data.exercises
                    .map(x => {
                        if(x.instanceId === req.body.exercise.instanceId)
                        { 
                            // console.log(req.body.exercise);
                            return req.body.exercise;
                        } else { return x }
                    });

                console.log(updatedExercises);

                Workout.findOneAndUpdate(
                    {
                        _id: req.body.workoutId,
                    },
                    {
                        $set: {
                            exercises: updatedExercises
                        }
                    },
                    { useFindAndModify: false },
                    async (err, data) => {
                        try {
                            if(err) {
                                res.status(400).json({msg: 'Something went wrong: ', err})
                            }
                            if(!data) {
                                res.status(400).json({msg: 'No workout found'})
                            }
                            res.status(201).json({msg: 'Exercise in Workout updated'})
                        } catch (err) {
                            res.status(400).json({msg: 'Something went wrong: ', err})
                        }
                    }
                )

            }
            catch (err) {
                res.status(400).json( { msg: 'Something went wrong: ', err } )
            }
        })

});

//delete exerciseInWorkout

router.patch('/deleteExerciseInWorkout', ensureAuthenticated, async (req, res) => {
    Workout.findOne(
        {
            _id: req.body.workoutId,
        },
        async (err, data) => {
            try {
                if (err) {
                    res.status(400).json( { msg: 'Something went wrong: ', err } )
                }
                if(!data) {
                    res.status(404).json({ msg: 'No workout found' })
                }
                
                const filteredExercises = data.exercises.filter(x => x.instanceId != req.body.exerciseInstanceId);
                
                Workout.findOneAndUpdate(
                    {
                        _id: req.body.workoutId,
                    },
                    {
                        $set: {
                            exercises: filteredExercises
                        }
                    },
                    { useFindAndModify: false },
                    async (err, data) => {
                        try {
                            if(err) {
                                res.status(400).json({msg: 'Something went wrong: ', err})
                            }
                            if(!data) {
                                res.status(404).json({msg: 'No workout found'})
                            }
                            res.status(201).json({msg: 'Exercise in Workout deleted'})
                        } catch (err) {
                            res.status(400).json({msg: 'Something went wrong: ', err})
                        }
                    }
                )

            } catch (err) {
                res.status(400).json( { msg: 'Something went wrong: ', err } )
            }
        }
    )
});

module.exports = router;