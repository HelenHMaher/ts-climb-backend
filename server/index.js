const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const express = require('express');

const auth = require('./routes/authenticate');
const exercisesApi = require('./routes/exercises');
const profilesApi = require('./routes/profiles');

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

// TODO: this is for production, not required for development
// remove : " "proxy": "http://localhost:3001", " to package.json

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, '../build', 'index.html'));
// });

// app.use('/', express.static(path.join(__dirname, '../build')));

app.use('/authenticate', auth);
app.use('/api/exercises', exercisesApi);
app.use('/api/profiles', profilesApi);

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
