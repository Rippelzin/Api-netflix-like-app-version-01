const express = require('express');
const router = express.Router();
const episodeController = require('../controllers/episodeController');
const auth = require('../middleware/auth');


router.get('/:episode_id',auth, episodeController.getEpisode);
router.post('/',auth, episodeController.addEpisode);
router.put('/',auth, episodeController.updateEpisode);
router.delete('/',auth, episodeController.deleteEpisode);


module.exports = router;