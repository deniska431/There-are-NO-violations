var express = require('express');
var router = express.Router();
app.use((req, res, next) => {
  res.locals.userId = req.session.userId ? req.session.userId : null; // передаем userId во все шаблоны
  next();
});
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
