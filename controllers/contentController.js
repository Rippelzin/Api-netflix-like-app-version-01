const db = require('../config/db');

exports.getContent = async (req, res) => {
    try {
        const [content] = await db.query(`
            SELECT 'movie' AS content_type, movie_id, title, description, duration, age_rating, cover_image_url, video_url, NULL AS episode_count, created_at, updated_at
            FROM movies
            UNION ALL
            SELECT 'series' AS content_type, series_id, title, description, duration, age_rating, cover_image_url, video_url, episode_count, created_at, updated_at
            FROM series
            ORDER BY RAND()
        `);
        res.json(content);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


