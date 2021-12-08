const router = require('express').Router();

router.get('/', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.status(500).json({ message: 'Ошибка при удалении сессии' });
      return;
    }
    res
      .clearCookie('sid')
      .redirect('/');
  });
});

module.exports = router;
