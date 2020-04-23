const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('respond with a resource in users');
});

module.exports = router;
