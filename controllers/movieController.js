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

exports.updateMovie = async (req, res) => {
    const { movie_id, title, description, duration, age_rating, cover_image_url, video_url } = req.body;

    try {
        // Atualiza o filme com base no movie_id
        const result = await db.query(
            'UPDATE movies SET title = ?, description = ?, duration = ?, age_rating = ?, cover_image_url = ?, video_url = ?, updated_at = NOW() WHERE movie_id = ?',
            [title, description, duration, age_rating, cover_image_url, video_url, movie_id]
        );

        // Verifica se o filme foi atualizado
        if (result[0].affectedRows === 0) {
            return res.status(404).json({ message: 'Movie not found!' });
        }

        res.json({ message: 'Movie updated successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteMovie = async (req, res) => {
    const { movie_id } = req.body; // ID do filme a ser deletado

    if (!movie_id) {
        return res.status(400).json({ error: "Movie ID is required." });
    }

    try {
        const result = await db.query(
            'DELETE FROM movies WHERE movie_id = ?',
            [movie_id]
        );

        // Verifica se o filme foi encontrado e deletado
        if (result[0].affectedRows === 0) {
            return res.status(404).json({ message: "Movie not found!" });
        }

        res.json({ message: "Movie deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


