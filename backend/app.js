const express = require('express');

const bodyParser = require('body-parser');
const contactusRoute = require('./routes/contactus');
const libraryRoute = require('./routes/library');
const testRoute = require('./routes/test');
const messageRoute = require('./routes/message')
const accountRoute = require('./routes/account')
const settingsRoute = require('./routes/settings')

const session = require('express-session');
const cors = require("cors");
const db = require('./config/dbConfig')
const MySQLStore = require('express-mysql-session')(session);

const app = express();
const sessionStore = new MySQLStore({}, db);

app.use(session({
  key: "userId",
  secret: 'studycircle',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: false, // Set to true if using HTTPS
    maxAge: 1000 * 60 * 60 * 24 
  }
}));

app.use(express.static('public'));

app.use( cors({
  // origin: '*',
  origin: 'http://localhost:3000',
  credentials:true
  // credentials:"include"
}));

app.use((req, res, next) => {
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/',testRoute);

app.use('/account', accountRoute);
app.use('/contactus', contactusRoute);
app.use('/library', libraryRoute);
app.use('/message', messageRoute)
app.use('/settings', settingsRoute)

app.get('/logout',  (req, res) => {
  console.log("logout")
  res.status(200).clearCookie('jwtoken').send("logged out")
})

app.post('/login', (req, res)=> {
  console.log(req.body)
  res.status(200).cookie('jwtoken', "hacked by artist dk", {
    expires: new Date(Date.now() + 60 * 60 * 24 * 1000), // Expires in 24 hours
    httpOnly: false
  })
  res.send("logged in")
  console.log("hacked")
})


const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
