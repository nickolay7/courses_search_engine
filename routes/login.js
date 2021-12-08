const router = require('express').Router();
const { User } = require('../db/models');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
  const { error } = req.query;
  res.render('entries/login', { error });
});

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  const userInDb = await User.findOne({ where: { email: email }});
  if (!userInDb) {
    res.redirect('/reg?error=user_not_found');
  }
  const isCorrectPassword = await bcrypt.compare(password, userInDb.password);
  if (!isCorrectPassword) {
    res.redirect('/reg?error=wrong_password');
  }

  req.session.user = userInDb.name;
  req.session.userId = userInDb.id;

  res.redirect('/');
});

module.exports = router;
