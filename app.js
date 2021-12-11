const express = require('express');
const Sequelize = require("sequelize");
const createError = require('http-errors');
const logger = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
// const FileStore = require('session-file-store')(session);
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const cors = require('cors');
const { app, serverStart } = require('./server');
const { connect } = require('./db');

serverStart().then(connect);

const sequelize = new Sequelize("database", "username", "password", {
  dialect: "sqlite",
  storage: "./session.sqlite",
});

const myStore = new SequelizeStore({
  db: sequelize,
});

const sessionConfig = {
  store: myStore,
  name: 'sid',
  secret: process.env.SESSION_SECRET ?? ['keyboard cat', 'old keyword'],
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
    secure: process.env.NODE_ENV === 'production',
  }
};


app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(session(sessionConfig));
myStore.sync();

const indexRouter = require('./routes/index');
const entriesRouter = require('./routes/entries');
const regRouter = require('./routes/reg');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const likeRouter = require('./routes/course');
const personalRouter = require('./routes/personal');

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.id = req.session.userId;
  next();
});

app.use('/', indexRouter);
app.use('/entries', entriesRouter);
app.use('/reg', regRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/course', likeRouter);
app.use('/personal', personalRouter);
