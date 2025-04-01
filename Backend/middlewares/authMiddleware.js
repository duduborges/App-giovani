import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req, res, next) => {
     console.log("oii")
     let token = req.headers['authorization'];
     console.log(token)
     if (!token) {
          return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
     }

     // Se o token vier com o prefixo "Bearer ", remova-o
     if (token.startsWith('Bearer ')) {
          token = token.slice(7, token.length).trim();
     }

     try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = decoded; // adiciona os dados decodificados ao request
          next();
     } catch (err) {
          return res.status(400).json({ error: 'Token inválido' });
     }
};
