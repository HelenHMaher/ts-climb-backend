const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// ----------AUTHENTICATE ROUTER-----------------------

// POST "/authenticate/login"
// {"username":"Admin", "password":"password"}

router.post('/login', (req, res) => {
  // check if username and password are entered
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ msg: 'Please enter a username and a password' });
  }
  User.findOne({ username }, async (err, user) => {
    try {
      // check for error
      if (err) {
        return res
          .status(400)
          .json({ msg: `Sorry something went wrong: ${err}` });
      }
      // check for existing users
      if (!user) {
        return res.status(400).json({ msg: 'User does not exist' });
      }
      // validate password
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({ msg: 'Invalid credentials' });
        jwt.sign(
          { username, id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: 86400 },
          (err, token) => {
            if (err) throw err;
            res.status(201).json({ token, msg: 'User successfully logged in' });
          }
        );
      }
    } catch (err) {
      console.log(err);
    }
  });
});

router.post('/register', (req, res) => {
  // check if username and password are ent
  const { username, password } = req.body;
  // email is case insensitive, for further processing I lower the whole email
  const email = req.body.email.toLowerCase();
  if (!username || !password || !email) {
    return res.status(400).json({ msg: 'Please fill in all fields!' });
  }
  User.findOne({ username }, async (err, user) => {
    try {
      // check for error
      if (err) {
        return res
          .status(400)
          .json({ msg: `Sorry something went wrong: ${err}` });
      }
      // check for existing users
      if (user) {
        return res
          .status(400)
          .json({ msg: 'Account already exists with this username' });
      }
      // check for existing email
      User.findOne({ email }, async (err, user) => {
        try {
          if (err) {
            return res
              .status(400)
              .json({ msg: `Sorry something went wrong: ${err}` });
          }
          // check for existing email
          if (user) {
            return res
              .status(400)
              .json({ msg: 'Account already exists with this email' });
          }

          // create salt & hash
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = new User({
            username,
            password: hashedPassword,
            email,
          });
          await newUser.save();

          // login user after user registered
          User.findOne({ username }, async (err, user) => {
            try {
              // check for error
              if (err) {
                return res
                  .status(400)
                  .json({ msg: `Sorry something went wrong: ${err}` });
              }
              // check for existing users
              if (!user) {
                return res.status(400).json({ msg: 'User does not exist' });
              }
              // validate password
              if (user) {
                jwt.sign(
                  { username, id: user._id },
                  process.env.JWT_SECRET,
                  { expiresIn: 86400 },
                  (err, token) => {
                    if (err) throw err;
                    res.status(201).json({
                      token,
                      msg: 'User successfully created and logged in',
                    });
                  }
                );
              }
            } catch (err) {
              console.log(err);
            }
          });
        } catch (err) {
          console.log(err);
        }
      });
    } catch (err) {
      console.log(err);
    }
  });
});

module.exports = router;

//----------AUTHENTICATE ROUTER-----------------------

//POST "/authenticate/login"
//{"username":"Admin", "password":"password"}

// router.post('/login', (req, res) => {
//   passport.authenticate('local', (err, user) => {
//     if (err) throw err;
//     if (!user)
//       res
//         .status(400)
//         .json({ msg: 'User information does not match our records' });
//     else {
//       req.logIn(user, err => {
//         if (err) {
//           return res
//             .status(400)
//             .json({ msg: 'Sorry something went wrong: ', err });
//         }
//         res.status(201).json({
//           msg: 'Successfully Authenticated',
//         });
//       });
//     }
//   })(req, res);
// });

// router.post('/register', (req, res) => {
//   User.findOne({ username: req.body.username }, async (err, doc) => {
//     try {
//       if (err) {
//         return res
//           .status(400)
//           .json({ msg: 'Sorry something went wrong: ', err });
//       }
//       if (doc) return res.status(400).json({ msg: 'User Already Exists' });

//       const hashedPassword = await bcrypt.hash(req.body.password, 10);

//       const newUser = new User({
//         username: req.body.username,
//         email: req.body.email,
//         password: hashedPassword,
//       });
//       await newUser.save();
//       res.status(201).json({ msg: 'User Created' });
//     } catch (error) {
//       return res.status(400).json({ msg: 'Something went wrong: ', error });
//     }
//   });
// });

// router.get('/user', ensureAuthenticated, (req, res) => {
//   res.status(201).json(req.user);
// });

// router.delete('/user', ensureAuthenticated, (req, res) => {
//   User.findOne({ _id: req.user.id }, async (err, doc) => {
//     try {
//       if (err) {
//         throw err;
//       }
//       if (!doc) {
//         res.status(400).json({ msg: 'No user found' });
//       }
//       res.status(200).json({ msg: 'User deleted' });
//     } catch (err) {
//       return res.status(400).json({ msg: 'Something went wrong: ', err });
//     }
//   });
// });

// router.get('/logout', ensureAuthenticated, (req, res) => {
//   const user = req.user.username;
//   req.logout();
//   res.status(201).json({ msg: `${user} Logged Out` });
// });

// module.exports = router;
