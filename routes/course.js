const router = require('express').Router();
const { Course, User } = require('../db/models');
const { app, serverStart } = require('../server');

function isLogged(req, res, next) {
  if (req.session.user) return next();
  return res.render('entries/warn');
}

router.get('/:id', isLogged, async (req, res) => {
  const id = req.params.id;
  const course = app.locals.onQuery.find((item) => item.id == id);
  res.render('entries/course', { course });
});

router.get('/:id/add', isLogged, async (req, res) => {
  const id = req.params.id;
  const course = app.locals.onQuery.find((item) => item.id == id);
  const { title, url, coupon_code, thumbnail} = course;
  const hasCourse = await Course.findOne({ where: { title, user_id: req.session.userId }});
  if (hasCourse) {
    return res.render('error', { message: 'Course already exist!'});
  }
  try {
    await Course.create({ title, user_id: res.locals.id, url, coupon_code, thumbnail});
    return res.render('entries/course', { course, message: 'Bookmark added!' });
  } catch (error) {
    res.render('error', {
      message: 'Sorry couldn\'t add bookmark.',
      error: {}
    });
  }
});

module.exports = router;
