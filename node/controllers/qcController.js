const { OQC, TransferQc } = require('../models');

exports.createOqcRecord = async (req, res) => {
    try {
        const oqcData = { ...req.body, inspector_id: req.user.id };
        const newOqc = await OQC.create(oqcData);
        res.status(201).json(newOqc);
    } catch (error) {
        res.status(500).json({ message: 'Gagal membuat catatan OQC', error: error.message });
    }
};

exports.createTransferQc = async (req, res) => {
    try {
        const transferData = { ...req.body, user_id: req.user.id };
        const newTransfer = await TransferQc.create(transferData);
        res.status(201).json(newTransfer);
    } catch (error) {
        res.status(500).json({ message: 'Gagal membuat catatan Transfer QC', error: error.message });
    }
};
