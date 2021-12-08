const router = require('express').Router();
const {Post, User} = require('../db/models');

function isLogged(req, res, next) {
  if (req.session.user) return next();
  return res.render('entries/warn');
}

router.get('/:id', isLogged, async (req, res) => {
  const post = await Post.findOne({where: {id: req.params.id}});
  if (req.session.userId !== post.user_id) {
    post.likes += 1;
    post.save();
  }

  res.redirect('/');
});

module.exports = router;
