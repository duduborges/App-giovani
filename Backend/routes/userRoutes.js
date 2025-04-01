import express from 'express';
import db from '../services/db.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();



router.get('/me', verifyToken, (req, res) => {
     const userId = req.user.id;
     const query = `
       SELECT id, first_name, last_name, email, phone, bio, facebook, x_com, linkedin, instagram,
              country, city_state, postal_code, tax_id, created_at 
       FROM users 
       WHERE id = ?`;
     db.query(query, [userId], (err, results) => {
          if (err) {
               console.error('Erro ao buscar usuário:', err);
               return res.status(500).json({ error: 'Erro ao buscar usuário' });
          }
          if (results.length === 0) {
               return res.status(404).json({ error: 'Usuário não encontrado' });
          }
          res.json(results[0]);
     });
});




router.get('/:id', (req, res) => {
     const userId = req.params.id;

     const query = 'SELECT id, first_name, last_name, email, created_at FROM users WHERE id = ?';
     db.query(query, [userId], (err, results) => {
          if (err) {
               console.error('Erro ao buscar usuário:', err);
               return res.status(500).json({ error: 'Erro ao buscar usuário' });
          }
          if (results.length === 0) {
               return res.status(404).json({ error: 'Usuário não encontrado' });
          }
          res.json(results[0]);
     });
});

router.put('/me/info', verifyToken, (req, res) => {
     const userId = req.user.id;
     const { first_name, last_name, email, phone, bio, facebook, x_com, linkedin, instagram } = req.body;

     // Valida os dados, se necessário

     const query = `
       UPDATE users 
       SET first_name = ?, last_name = ?, email = ?, phone = ?, bio = ?, 
           facebook = ?, x_com = ?, linkedin = ?, instagram = ?
       WHERE id = ?`;
     db.query(query, [first_name, last_name, email, phone, bio, facebook, x_com, linkedin, instagram, userId], (err, results) => {
          if (err) {
               console.error('Erro ao atualizar informações pessoais:', err);
               return res.status(500).json({ error: 'Erro ao atualizar informações pessoais' });
          }
          if (results.affectedRows === 0) {
               return res.status(404).json({ error: 'Usuário não encontrado' });
          }
          res.json({ message: 'Informações pessoais atualizadas com sucesso' });
     });
});

router.put('/me/address', verifyToken, (req, res) => {
     const userId = req.user.id;
     const { country, city_state, postal_code, tax_id } = req.body;

     // Valide os campos, se necessário

     const query = `
       UPDATE users 
       SET country = ?, city_state = ?, postal_code = ?, tax_id = ?
       WHERE id = ?`;
     db.query(query, [country, city_state, postal_code, tax_id, userId], (err, results) => {
          if (err) {
               console.error('Erro ao atualizar endereço:', err);
               return res.status(500).json({ error: 'Erro ao atualizar endereço' });
          }
          if (results.affectedRows === 0) {
               return res.status(404).json({ error: 'Usuário não encontrado' });
          }
          res.json({ message: 'Endereço atualizado com sucesso' });
     });
});


export default router;
