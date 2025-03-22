var express = require('express');
var router = express.Router();
const { Request, User } = require('../public/models');

// Страница создания заявки
router.get('/create-request', (req, res) => {
    res.render('create-request'); // Отправляем представление
});

// Обработка создания заявки
router.post('/create-request', async (req, res) => {
    const { address, serviceType, paymentMethod, date } = req.body;
    const userId = req.session.userId;
    if (!userId) {
        return res.status(403).json({ error: "Пользователь не авторизован" });
    }
    try {
        await Request.create({ userId, address,  date, status: 'новая заявка' });
        res.redirect('/create-request');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;