const router = require('express').Router();
const { Post, User } = require('../db/models/');

function isLogged(req, res, next) {
  if (req.session.user) return next();
  return res.render('entries/warn');
}

async function isOwner(req, res, next) {
  let entry = await Post.findOne({where: {id: req.params.id}});
  if (req.session.userId === entry.user_id) return next();
  return res.render('entries/warn');
}

router.get('/', async (req, res) => {
  let posts;
  try {
    posts = await Post.findAll({include: 'User',where: { user_id: res.locals.id }, raw: true});
  } catch (error) {
    return res.render('error', {
      message: 'Не удалось получить записи из базы данных.',
      error: {}
    });
  }

  return res.render('entries/personalPage', { posts });
});

router.get('/edit/:id', async (req, res) => {
  const post = await Post.findOne({ where: { id: req.params.id}});
  res.render('entries/edit', { id: post.id, post: post.post});
});

router.post('/', async (req, res) => {
  const { post } = req.body;
  console.log(res.locals)
  try {
    await Post.create({ post: post, user_id: res.locals.id});
    return res.redirect('/');
  } catch (error) {
    res.render('error', {
      message: 'Не удалось добавить запись в базу данных.',
      error: {}
    });
  }
});



router.post('/edit/:id', isLogged, async (req, res) => {
  try {
    await Post.update({post: req.body.editedText}, { where: {id: req.params.id}});
  } catch (error) {
    return res.render('personal', {error: 'Не удалось обновить запись в базе данных.'});
  }

  return res.redirect('/personal');
});

router.get('/del/:id', isOwner, async (req, res) => {
  await Post.destroy({where: {id: req.params.id}});
  res.redirect('/personal');
});

module.exports = router;
