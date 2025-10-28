const { ProductionOrder, OutputMc } = require('../models');

exports.createProductionOrder = async (req, res) => {
    try {
        const poData = { ...req.body, created_by_id: req.user.id };
        const newOrder = await ProductionOrder.create(poData);
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: 'Gagal membuat Production Order', error: error.message });
    }
};

exports.createOutputMc = async (req, res) => {
    try {
        const outputData = { ...req.body, operator_id: req.user.id };
        const newOutput = await OutputMc.create(outputData);
        res.status(201).json(newOutput);
    } catch (error) {
        res.status(500).json({ message: 'Gagal membuat data output mesin', error: error.message });
    }
};
