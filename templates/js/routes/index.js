var express = require('express');
var router = express.Router();

// Главная страница
router.get('/', function(req, res) {
  res.render('index'); 
});

router.get('/admin', function(req, res) {
  res.render('admin'); 
});

router.get('/create-request', function(req, res) {
  res.render('create-request'); 
});

router.get('/login', function(req, res) {
  res.render('login'); 
});

router.get('/register', function(req, res) {
  res.render('register'); 
});

router.get('/services', function(req, res) {
  res.render('services'); 
});


module.exports = router;