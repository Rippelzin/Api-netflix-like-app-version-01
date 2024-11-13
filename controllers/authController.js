const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../config/db')
const { body, validationResult } = require('express-validator');


// Método para registrar um novo usuário
exports.register = [
    // Validação de entrada
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 4 }).withMessage('Password must be at least 6 characters long'),
    
    async (req, res) => {
        // Captura os erros de validação
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            // Verifica se o email já está em uso
            const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
            if (existingUser.length > 0) {
                return res.status(400).json({ error: 'Email is already in use' });
            }

            // Hash da senha antes de salvar
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Insere o novo usuário no banco de dados
            const result = await db.query(
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                [name, email, hashedPassword]
            );

            // Cria um token JWT para o novo usuário
            const token = jwt.sign({ id: result[0].insertId }, process.env.JWT_SECRET, { expiresIn: '30d' });

            // Retorna uma resposta com o token e uma mensagem de sucesso
            res.status(201).json({
                message: 'User registered successfully',
                token
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
];

exports.login = async(req,res) => {
    const{email, password} = req.body
    
    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email])


    if (!user || !await bcrypt.compare(password, user[0].password)) {
        return res.status(400).json({error: 'invalid credentials'})
    }
  
    const token = jwt.sign({ id: user[0].user_id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token });

}