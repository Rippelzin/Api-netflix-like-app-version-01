const db = require('../config/db');

exports.getMovies = async (req, res) => {
    try {
        const [movies] = await db.query('SELECT * FROM movies');
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addMovie = async (req, res) => {
    const { title, description, duration, age_rating, cover_image_url, video_url } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO movies (title, description, duration, age_rating, cover_image_url, video_url) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, duration, age_rating, cover_image_url, video_url]
        );
        res.json({ message: 'Movie added successfully!', movieId: result[0].insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
