const db = require('../config/db');

exports.getEpisode = async (req, res) => {
    const { episode_id } = req.params; // Obtém o ID dos parâmetros da URL

    if (!episode_id) {
        return res.status(400).json({ error: "Episode ID is required." });
    }

    try {
        const result = await db.query(
            'SELECT * FROM episodes WHERE episode_id = ?',
            [episode_id]
        );

        if (result[0].length === 0) {
            return res.status(404).json({ message: "Episode not found!" });
        }

        res.json(result[0]); // Retorna o episódio encontrado
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.addEpisode = async (req, res) => {
    const { series_id, title, duration, age_rating, description, video_url, episode_number } = req.body;

    if (!series_id) {
        return res.status(400).json({ error: "Series ID is required." });
    }

    try {
        const result = await db.query(
            'INSERT INTO episodes (series_id, title, duration, age_rating, description, video_url, episode_number) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [series_id, title, duration, age_rating, description, video_url, episode_number]
        );

        res.json({ message: 'Episode added successfully!', episodeId: result[0].insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateEpisode = async (req, res) => {
    const { episode_id, series_id, title, duration, age_rating, description, video_url, episode_number } = req.body;

    if (!episode_id) {
        return res.status(400).json({ error: "Episode ID is required." });
    }

    try {
        const result = await db.query(
            'UPDATE episodes SET series_id = ?, title = ?, duration = ?, age_rating = ?, description = ?, video_url = ?, episode_number = ?, updated_at = NOW() WHERE episode_id = ?',
            [series_id, title, duration, age_rating, description, video_url, episode_number, episode_id]
        );

        if (result[0].affectedRows === 0) {
            return res.status(404).json({ message: "Episode not found!" });
        }

        res.json({ message: 'Episode updated successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteEpisode = async (req, res) => {
    const { episode_id } = req.body;

    if (!episode_id) {
        return res.status(400).json({ error: "Episode ID is required." });
    }

    try {
        const result = await db.query(
            'DELETE FROM episodes WHERE episode_id = ?',
            [episode_id]
        );

        if (result[0].affectedRows === 0) {
            return res.status(404).json({ message: "Episode not found!" });
        }

        res.json({ message: 'Episode deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



