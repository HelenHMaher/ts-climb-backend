const express = require('express');

const router = express.Router();
const User = require('../models/user');
const ensureAuthenticated = require('../ensureAuthenticated');

// ----------GET PROFILE INFORMANTION----------

router.get('/user', ensureAuthenticated, (req, res) => {
  User.findOne({ _id: req.user.id }, async (err, data) => {
    try {
      if (err) throw err;
      if (data) {
        res.send({ msg: 'profile found', profile: data });
      }
    } catch (err) {
      return res.status(400).json({ msg: 'Something went wrong: ', err });
    }
  });
});

module.exports = router;
