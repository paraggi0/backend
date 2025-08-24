const express = require('express');
const router = express.Router();
const verifyAuth = require('../middleware/authMiddleware');
const productionController = require('../controllers/productionController');
router.post('/orders', verifyAuth, productionController.createProductionOrder);
router.post('/outputs', verifyAuth, productionController.createOutputMc);
module.exports = router;
