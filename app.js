const express = require('express');
const app = express();
const movieRoutes = require('./routes/movieRoutes');
const serieRoutes = require('./routes/serieRoutes');
const authRoutes = require('./routes/authRoutes')

app.use(express.json());


app.use('/api/movies', movieRoutes);
app.use('/api/series', serieRoutes)
app.use('/api/auth', authRoutes)



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});