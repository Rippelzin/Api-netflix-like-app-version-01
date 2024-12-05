const express = require('express');
const router = express.Router();
const serieController = require('../controllers/serieController');
const auth = require('../middleware/auth');



// Rota para buscar todas as séries
router.get('/', auth, serieController.getSeries);

// Rota para buscar uma série pelo ID
router.get('/:id', auth, serieController.getSeriesById);

// Rota para buscar episódios de uma série pelo ID
router.get('/:id/episodes', auth, serieController.getEpisodesBySeriesId);


router.get('/names', auth, serieController.getSeriesNames);


router.post('/', auth, serieController.addSeries);
router.put('/', auth, serieController.updateSeries);
router.delete('/', auth, serieController.deleteSeries);


module.exports = router;
