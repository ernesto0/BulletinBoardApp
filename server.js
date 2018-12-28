const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');


const users = require('./routes/api/users');
const events = require('./routes/api/events');
const orgs = require('./routes/api/orgs');




const app = express();

//body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//DB config
const db = require('./config/keys').mongoURI;

//Connect to MongoDB
mongoose
.connect(db, { useNewUrlParser: true })
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

//passport middleware
app.use(passport.initialize());

//passport config
require('./config/passport')(passport);

//Use routes
app.use('/api/users', users);
app.use('/api/events', events);
app.use('/api/orgs', orgs);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));