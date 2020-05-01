const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middlewares/authorization');
const { upload } = require('../middlewares/uploadAudio');
const usersController = require('../controller/users.controller');

router.post('/login', usersController.getLoginOrSignup);
router.post('/auth', usersController.getAuth);
router.post('/:user_id/consultings', ensureAuthenticated, upload.single('audio'), usersController.saveAudio);
router.get('/:user_id/consultings', ensureAuthenticated, usersController.getConsultings);

module.exports = router;
