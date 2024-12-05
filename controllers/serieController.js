const db = require('../config/db');

exports.getSeries = async (req, res) => {
    try {
        const [series] = await db.query('SELECT * FROM series');
        res.json(series);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSeriesNames = async (req, res) => {
  try {
    // Supondo que a coluna correta para o identificador seja 'series_id'
    const [seriesNames] = await db.query('SELECT title FROM series');
    console.log(seriesNames);
    res.json(seriesNames); // Retorna os títulos das séries
  } catch (error) {
    console.error("Erro ao buscar os títulos das séries:", error);
    res.status(500).json({ error: error.message }); // Exibe o erro no formato JSON
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


  exports.addSeries = async (req, res) => {
    const { title, description, duration, age_rating, cover_image_url, video_url, episode_count, genres } = req.body;

    // Verificando se o campo 'genres' é uma string ou array de gêneros, caso seja um array, transformamos em string separada por vírgulas
    let genresString = "";
    if (Array.isArray(genres)) {
        genresString = genres.join(","); // Transformando o array em uma string separada por vírgulas
    } else {
        genresString = genres; // Caso já seja uma string, mantemos como está
    }

    try {
        // Inserindo dados na tabela 'series'
        const result = await db.query(
            'INSERT INTO series (title, description, duration, age_rating, cover_image_url, video_url, episode_count, genres) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [title, description, duration, age_rating, cover_image_url, video_url, episode_count, genresString]
        );

        // Resposta de sucesso, com o ID da série inserida
        res.json({ message: 'Series added successfully!', seriesId: result[0].insertId });
    } catch (error) {
        // Caso haja um erro, retornamos o erro
        res.status(500).json({ error: error.message });
    }
};



exports.updateSeries = async (req, res) => {
  const { series_id, title, description, duration, age_rating, cover_image_url, video_url, episode_count } = req.body;

  if (!series_id) {
      return res.status(400).json({ error: "Series ID is required." });
  }

  try {
      const result = await db.query(
          'UPDATE series SET title = ?, description = ?, duration = ?, age_rating = ?, cover_image_url = ?, video_url = ?, episode_count = ?, updated_at = NOW() WHERE series_id = ?',
          [title, description, duration, age_rating, cover_image_url, video_url, episode_count, series_id]
      );

      if (result[0].affectedRows === 0) {
          return res.status(404).json({ message: "Series not found!" });
      }

      res.json({ message: 'Series updated successfully!' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


exports.deleteSeries = async (req, res) => {
  const { series_id } = req.body;

  if (!series_id) {
      return res.status(400).json({ error: "Series ID is required." });
  }

  try {
      const result = await db.query(
          'DELETE FROM series WHERE series_id = ?',
          [series_id]
      );

      if (result[0].affectedRows === 0) {
          return res.status(404).json({ message: "Series not found!" });
      }

      res.json({ message: 'Series deleted successfully!' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

