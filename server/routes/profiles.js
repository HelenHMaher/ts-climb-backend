const express = require('express');

const router = express.Router();
const User = require('../models/user');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

// ----------GET PROFILE INFORMANTION----------

router.get('/user', ensureAuthenticated, (req, res) => {
  User.findOne({ _id: req.body.userId }, async (err, data) => {
    try {
      if (err) throw err;
      if (data) {
        res.send({ msg: 'profile found', profile: data });
      }
    } catch (err) {
      console.log('there was a problem finding the profile: ', err);
    }
  });
});

module.exports = router;
