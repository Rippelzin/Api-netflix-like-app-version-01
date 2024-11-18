const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const auth = require('../middleware/auth')

router.get('/',auth, contentController.getContent);


module.exports = router;
