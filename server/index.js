const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const express = require('express');

const auth = require('./routes/authenticate');
const exercisesApi = require('./routes/exercises');
const userApi = require('./routes/user');
const workoutsApi = require('./routes/workouts');
const exerciseInWorkoutApi = require('./routes/exerciseInWorkout');

const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();

//---------------End of Imports---------------------

const MONGO_USER = process.env.MONGOUSER;
const MONGO_PW = process.env.MONGOPW;

mongoose.connect(
  `mongodb+srv://${MONGO_USER}:${MONGO_PW}@cluster0.zsz9c.mongodb.net/my-daily-climb?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) {
      console.log(`${MONGO_USER} not connected to database ` + err);
    } else {
      console.log(`${MONGO_USER} Connected To MongoDB`);
    }
  }
);

app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://my-daily-climb.netlify.app'],
    credentials: true,
  })
);

//MIDDLEWARE

app.use(express.json());

const SESSION_SECRET = process.env.SESSIONSECRET;

app.use(
  session({ secret: SESSION_SECRET, resave: true, saveUninitialized: true })
);

app.use(cookieParser(SESSION_SECRET));
app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport);

//-----------End of Middleware ---------------------------
//ROUTES

app.use('/authenticate', auth);
app.use('/api/exercises', exercisesApi);
app.use('/api/profiles', userApi);
app.use('/api/workouts', workoutsApi);
app.use('/api/exerciseInWorkout', exerciseInWorkoutApi);

//--------------End of Routes --------------------------

process.on('SIGNIT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose disconnected');
    process.exit(0);
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
