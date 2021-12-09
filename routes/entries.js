const axios = require('axios');
const router = require('express').Router();
const { Course, User } = require('../db/models/');
// const { lastQuery, onQuery } = require('../public/data');
const { app, serverStart } = require('../server');

function isLogged(req, res, next) {
  if (req.session.user) return next();
  return res.render('entries/warn');
}

const withNewDate = (items) => {
  const transform = (date) => new Date(date);
  return items.map((el, index) => ({ ...el, last_updated: transform(el.last_updated), id: index, category: el.category[0] }));
}

router.get('/', async (req, res) => {
  let options = {
    method: 'GET',
    url: 'https://udemy-courses-coupon-code.p.rapidapi.com/api/udemy_course/',
    headers: {
      'x-rapidapi-host': 'udemy-courses-coupon-code.p.rapidapi.com',
      'x-rapidapi-key': '7f7a294054msh26933b5b2819408p138b11jsnccb0b189beed'
    }
  };

  let lastQuery;
  try {
    const response = await axios.request(options);
    lastQuery = await response.data;
  } catch (error) {
    return res.render('error', {
      message: 'Server is lost;)',
      error: {}
    });
  }
  const courses = req.session.user ? lastQuery : lastQuery.slice(0, 3);
  app.locals.onQuery = withNewDate(lastQuery);

  return res.render('entries/index', { ok: req.query.ok, courses: withNewDate(courses) });
});

router.post('/', isLogged, async (req, res) => {
  const { query } = req.body;
  let options = {
    method: 'GET',
    url: `https://udemy-courses-coupon-code.p.rapidapi.com/api/udemy_course/${ query }`,
    headers: {
      'x-rapidapi-host': 'udemy-courses-coupon-code.p.rapidapi.com',
      'x-rapidapi-key': '7f7a294054msh26933b5b2819408p138b11jsnccb0b189beed'
    }
  };

  let onQuery;
  try {
    const response = await axios.request(options);
    onQuery = await response.data;
    console.log(onQuery);
  } catch (error) {
    return res.render('error', {
      message: 'Server is lost;)',
      error: {}
    });
  }
  app.locals.onQuery = withNewDate(onQuery);
  if (onQuery.length === 0) {
    return res.render('entries/warn');
  }

  return res.render('entries/index', { courses: withNewDate(onQuery) });
});

module.exports = router;
