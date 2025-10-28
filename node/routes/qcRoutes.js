const express = require('express');
const router = express.Router();
const verifyAuth = require('../middleware/authMiddleware');
const qcController = require('../controllers/qcController');
router.post('/oqc', verifyAuth, qcController.createOqcRecord);
router.post('/transfer', verifyAuth, qcController.createTransferQc);
module.exports = router;
