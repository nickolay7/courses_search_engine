const bcrypt = require('bcrypt');
const router = require('express').Router();
const { User } = require('../db/models');


router.get('/', (req, res) => {
  const { error } = req.query;
  res.render('entries/reg', { error });
});

router.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 5);
  const userInDb = await User.findOne({ where: { email: email }});
  if (userInDb) {
    res.redirect('/reg?error=user_already_exists');
  }
  await User.create({ name, email, password: hash });
  res.redirect('/entries/?ok=That\'s ok!');
});

module.exports = router;
