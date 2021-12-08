const axios = require('axios');
const router = require('express').Router();
const { Post, User } = require('../db/models/');
const { lastQuery, onQuery } = require('../public/data');

function isLogged(req, res, next) {
  if (req.session.user) return next();
  return res.render('entries/warn');
}

const withNewDate = (items) => {
  const transform = (date) => new Date(date);
  return items.map((el) => ({ ...el, last_updated: transform(el.last_updated) }));
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

  // let data;
  // try {
  //   const response = await axios.request(options);
  //   data = await response.data;
  //   console.log(data)
  //   // res.locals.data = data;
  // } catch (error) {
  //   return res.render('error', {
  //     message: 'Server is lost;)',
  //     error: {}
  //   });
  // }
  const courses = req.session.user ? lastQuery : lastQuery.slice(0, 3);

  return res.render('entries/index', { courses: withNewDate(courses) });
});

router.post('/', isLogged, async (req, res) => {
  const { query } = req.body;
  // try {
  //   await Post.create({post: post, user_id: res.locals.id});
  //   return res.redirect('/');
  // } catch (error) {
  //   res.render('error', {
  //     message: 'Не удалось добавить запись в базу данных.',
  //     error: {}
  //   });
  // }
  let options = {
    method: 'GET',
    url: `https://udemy-courses-coupon-code.p.rapidapi.com/api/udemy_course/${ query }`,
    headers: {
      'x-rapidapi-host': 'udemy-courses-coupon-code.p.rapidapi.com',
      'x-rapidapi-key': '7f7a294054msh26933b5b2819408p138b11jsnccb0b189beed'
    }
  };



  // let courses;
  // try {
  //   const response = await axios.request(options);
  //   courses = await response.data;
  //   console.log(courses)
  //   // res.locals.data = data;
  // } catch (error) {
  //   return res.render('error', {
  //     message: 'Server is lost;)',
  //     error: {}
  //   });
  // }

  const courses = req.session.user ? onQuery : onQuery.slice(0, 3);

  return res.render('entries/index', { courses: withNewDate(courses) });
});

module.exports = router;
