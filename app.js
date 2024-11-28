const express = require('express');
const app = express();
const movieRoutes = require('./routes/movieRoutes');
const serieRoutes = require('./routes/serieRoutes');
const episodeRoutes = require('./routes/episodeRoutes')
const contentRoutes = require('./routes/contentRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', // permite apenas essa origem
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // especifica os métodos permitidos
}))


app.use('/api/movies', movieRoutes);
app.use('/api/series', serieRoutes);
app.use('/api/episodes', episodeRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/auth', authRoutes);



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});