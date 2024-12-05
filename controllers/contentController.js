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

exports.getGenresCount = async (req, res) => {
    try {
        // Consulta SQL para contar os gêneros nos filmes e séries
        const [genresCount] = await db.query(`
            SELECT genre,
       SUM(CASE WHEN content_type = 'movie' THEN 1 ELSE 0 END) AS movies_count,
       SUM(CASE WHEN content_type = 'series' THEN 1 ELSE 0 END) AS series_count
FROM (
    -- Para movies
    SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(genres, ',', n.n), ',', -1)) AS genre, 'movie' AS content_type
    FROM movies
    JOIN (SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10) n
    ON CHAR_LENGTH(genres) - CHAR_LENGTH(REPLACE(genres, ',', '')) >= n.n - 1

    UNION ALL

    -- Para series
    SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(genres, ',', n.n), ',', -1)) AS genre, 'series' AS content_type
    FROM series
    JOIN (SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10) n
    ON CHAR_LENGTH(genres) - CHAR_LENGTH(REPLACE(genres, ',', '')) >= n.n - 1
) AS all_genres
GROUP BY genre
ORDER BY genre;

        `);

        // Resposta com os gêneros e a contagem de filmes e séries
        res.json(genresCount);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getGenresCountTotal = async (req, res) => {
    try {
        // Query para contar os gêneros, juntando as tabelas `movies` e `series`
        const [genres] = await db.query(`
            SELECT genre, COUNT(*) AS genre_count
            FROM (
                SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(genres, ',', n.n), ',', -1)) AS genre
                FROM movies
                JOIN (SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10) n
                ON CHAR_LENGTH(genres) - CHAR_LENGTH(REPLACE(genres, ',', '')) >= n.n - 1

                UNION ALL

                SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(genres, ',', n.n), ',', -1)) AS genre
                FROM series
                JOIN (SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10) n
                ON CHAR_LENGTH(genres) - CHAR_LENGTH(REPLACE(genres, ',', '')) >= n.n - 1
            ) AS all_genres
            GROUP BY genre
            ORDER BY genre_count DESC
        `);

        // Retornando a resposta com os gêneros e contagens
        res.json({ genres });
    } catch (error) {
        // Tratamento de erros
        res.status(500).json({ error: error.message });
    }
};

