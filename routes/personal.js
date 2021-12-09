const router = require('express').Router();
const { Course, User } = require('../db/models/');

function isLogged(req, res, next) {
  if (req.session.user) return next();
  return res.render('entries/warn');
}

async function isOwner(req, res, next) {
  let entry = await Course.findOne({where: {id: req.params.id}});
  if (req.session.userId === entry.user_id) return next();
  return res.render('entries/warn');
}

router.get('/', async (req, res) => {
  let courses;
  try {
    courses = await Course.findAll({include: 'User',where: { user_id: res.locals.id }});
  } catch (error) {
    return res.render('error', {
      message: 'Sorry couldn\'t get courses.',
      error: {}
    });
  }

  return res.render('entries/personalPage', { courses });
});

router.get('/del/:id', isOwner, async (req, res) => {
  await Course.destroy({where: {id: req.params.id}});
  res.redirect('/personal');
});

module.exports = router;
