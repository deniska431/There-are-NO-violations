var express = require('express');
var router = express.Router();
const { Request, User } = require('../public/models');

// Панель администратора - получение всех заявок
router.get('/admin/requests', async (req, res) => {
    try {
        const requests = await Request.findAll({ include: User });
        res.json(requests.map(request => ({
            id: request.id,
            name: request.User.fullName,
            carNumber: request.carNumber,
            reason: request.reason,
            status: request.status,
            date: request.date,
            paymentMethod: request.paymentMethod,
            rejectReason: request.rejectReason
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Подтверждение заявки
router.post('/admin/requests/:id/confirm', async (req, res) => {
    const requestId = req.params.id;
    try {
        const request = await Request.findByPk(requestId);
        if (!request) {
            return res.status(404).json({ error: "Заявление не найдено" });
        }
        request.status = 'подтверждена';
        await request.save();
        res.json({ message: "Заявление подтверждено" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Завершение заявки
router.post('/admin/requests/:id/complete', async (req, res) => {
    const requestId = req.params.id;
    try {
        const request = await Request.findByPk(requestId);
        if (!request) {
            return res.status(404).json({ error: "Заявление не найдено" });
        }
        request.status = 'завершена';
        await request.save();
        res.json({ message: "Заявление завершено" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Отклонение заявки с указанием причины
router.post('/admin/requests/:id/reject', async (req, res) => {
    const requestId = req.params.id;
    const { reason } = req.body;
    try {
        const request = await Request.findByPk(requestId);
        if (!request) {
            return res.status(404).json({ error: "Заявление не найдено" });
        }
        request.status = 'отклонена';
        request.rejectReason = reason;
        await request.save();
        
        res.json({ message: "Заявление отклонено", reason });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получение всех зарегистрированных пользователей
router.get('/admin/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Удаление пользователя
router.delete('/admin/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "Пользователь не найден" });
        }

        await user.destroy();
        res.json({ message: "Пользователь удален" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;