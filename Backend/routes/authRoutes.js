import express from 'express';
import db from '../services/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;

router.post('/signin', async (req, res) => {
     const { firstName, lastName, email, password } = req.body;
     console.log(req.body);

     if (!firstName || !lastName || !email || !password) {
          return res.status(400).json({ error: 'Preencha todos os campos' });
     }

     try {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);

          // Insere o usuário no banco de dados usando as colunas first_name e last_name
          const query = 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
          db.query(query, [firstName, lastName, email, hashedPassword], (err, results) => {
               if (err) {
                    console.error('Erro no registro:', err);
                    return res.status(500).json({ error: 'Erro ao registrar usuário' });
               }
               res.status(201).json({ message: 'Usuário registrado com sucesso' });
          });
     } catch (error) {
          console.error('Erro na criptografia:', error);
          res.status(500).json({ error: 'Erro interno no servidor' });
     }
});


router.post('/login', async (req, res) => {
     try {
          const { email, password } = req.body;

          // Verifica se todos os campos foram preenchidos
          if (!email || !password) {
               return res.status(400).json({ error: 'Preencha todos os campos' });
          }

          // Usa a API de promises para buscar o usuário pelo e-mail
          const [results] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

          if (results.length === 0) {
               return res.status(400).json({ error: 'Usuário não encontrado' });
          }

          const user = results[0];

          // Compara a senha fornecida com a senha criptografada armazenada
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
               return res.status(400).json({ error: 'Senha incorreta' });
          }

          // Cria o token JWT com uma validade de 1 hora
          const token = jwt.sign(
               { id: user.id, email: user.email },
               jwtSecret,
               { expiresIn: '1h' }
          );

          res.json({ token });
     } catch (error) {
          console.error('Erro no login:', error);
          res.status(500).json({ error: 'Erro ao efetuar login' });
     }
});


export default router;
