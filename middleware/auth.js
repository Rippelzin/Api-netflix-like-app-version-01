// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Obtém o token do header 'Authorization'
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    // Verifica se o token está presente
    if (!token) {
        return res.status(400).json({ error: 'Not authenticated' });
    }

    try {
        // Verifica o token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Adiciona o payload do token ao objeto req para uso nas rotas
        next(); // Continua para a próxima função no ciclo de middleware (a rota protegida)
    } catch (error) {
        return res.status(400).json({ error: 'Invalid token' });
    }
};