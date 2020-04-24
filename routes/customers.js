const express = require('express');
const router = express.Router();
const customersController = require('../controller/customers.controller');

router.post('/', customersController.getCutomer);

module.exports = router;
