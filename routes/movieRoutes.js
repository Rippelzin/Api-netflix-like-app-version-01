const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const auth = require('../middleware/auth')

router.get('/',auth, movieController.getMovies);
router.post('/',auth, movieController.addMovie);
router.put('/', auth, movieController.updateMovie);
router.delete('/', auth, movieController.deleteMovie)

module.exports = router;
