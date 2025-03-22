var express = require('express');
var router = express.Router();
const { Request } = require('../public/models');

// Страница создания заявки
router.get('/create-request', (req, res) => {
    if (!req.session.userId) {
        return res.status(403).json({ error: "Пользователь не авторизован" });
    }
    res.render('create-request', { userId: req.session.userId });
});

// Обработка создания заявки
router.post('/create-request', async (req, res) => {
    const { carNumber, reason, date } = req.body;
    const userId = req.session.userId;
    if (!userId) {
        return res.status(403).json({ error: "Пользователь не авторизован" });
    }
    try {
        await Request.create({ userId, carNumber, reason, date, status: 'новая заявка' });
        res.redirect('/create-request');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Новый маршрут для получения истории заявок текущего пользователя
router.get('/user/requests', async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(403).json({ error: "Пользователь не авторизован" });
    }

    try {
        const requests = await Request.findAll({ where: { userId } });
        res.json(requests.map(request => ({
            carNumber: request.carNumber,
            date: request.date,
            status: request.status,
            reason: request.rejectReason || 'Нет'
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;