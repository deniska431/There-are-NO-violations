var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../public/models');

// Страница регистрации
router.get('/register', (req, res) => {
    res.render('register'); // Отправляем представление
});

// Обработка регистрации
router.post('/register', async (req, res) => {
    const { fullName, email, phone, username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ fullName, email, phone, username, password: hashedPassword });
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.send('Ошибка при регистрации');
    }
});

// Страница входа
router.get('/login', (req, res) => {
    res.render('login'); // Отправляем представление
});

// Обработка авторизации
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user.id; 
        res.redirect('/create-request');
    } else {
        res.send('Неверные учетные данные');
    }
});

// Страница профиля
router.get('/profile', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');  
    }

    try {
        const user = await User.findByPk(req.session.userId); 
        if (!user) {
            return res.redirect('/login'); 
        }
        res.render('profile', { user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при получении данных пользователя.');
    }
});


// Выход из профиля
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: "Ошибка при выходе" });
        }
        res.redirect('/login');
    });
});

module.exports = router;