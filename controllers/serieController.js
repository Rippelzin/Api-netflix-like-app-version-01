const db = require('../config/db');

exports.getSeries = async (req, res) => {
    try {
        const [series] = await db.query('SELECT * FROM series');
        res.json(series);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSeriesById = async (req, res) => {
  const { id } = req.params; // Obter o ID da série da URL

  try {
    const [series] = await db.query(`
      SELECT id, title, description, duration, age_rating, cover_image_url, video_url, episode_count, created_at, updated_at
      FROM series
      WHERE id = ?
    `, [id]);

    if (series.length === 0) {
      return res.status(404).json({ message: 'Série não encontrada.' });
    }

    res.json(series[0]); // Retornar o primeiro item, já que o ID é único
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getEpisodesBySeriesId = async (req, res) => {
    const { id } = req.params; // Obter o ID da série da URL
  
    try {
      const [episodes] = await db.query(`
        SELECT episode_id, title, duration, age_rating, description, video_url, episode_number
        FROM episodes
        WHERE series_id = ?
      `, [id]);
  
      if (episodes.length === 0) {
        return res.status(404).json({ message: 'Nenhum episódio encontrado para essa série.' });
      }
  
      res.json(episodes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
