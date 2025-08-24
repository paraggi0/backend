const { Delivery, Return } = require('../models');

exports.createDelivery = async (req, res) => {
    try {
        const deliveryData = { ...req.body, user_id: req.user.id };
        const newDelivery = await Delivery.create(deliveryData);
        res.status(201).json(newDelivery);
    } catch (error) {
        res.status(500).json({ message: 'Gagal membuat data delivery', error: error.message });
    }
};

exports.createReturn = async (req, res) => {
    try {
        const returnData = { ...req.body };
        const newReturn = await Return.create(returnData);
        res.status(201).json(newReturn);
    } catch (error) {
        res.status(500).json({ message: 'Gagal membuat data return', error: error.message });
    }
};
