const express = require('express');
const router = express.Router();
const { getProducts, getPolicy, updatePolicy } = require('../controllers/merchantController');

router.get('/products', getProducts);
router.get('/policy', getPolicy);
router.put('/policy', updatePolicy);

module.exports = router;
