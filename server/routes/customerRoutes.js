
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// GET /api/customers
router.get('/', customerController.getCustomers);

// POST /api/customers
router.post('/', customerController.createCustomer);

module.exports = router;
