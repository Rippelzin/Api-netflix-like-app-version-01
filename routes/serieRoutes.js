const express = require('express');
const router = express.Router();
const serieController = require('../controllers/serieController');
const auth = require('../middleware/auth');

router.get('/',auth,serieController.getSeries);
//router.post('/', serieController.addMovie);

module.exports = router;
