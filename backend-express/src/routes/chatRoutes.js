const express = require('express');
const router = express.Router();
const { handleChatInteraction } = require('../controllers/chatController');

router.post('/', handleChatInteraction);

module.exports = router;
