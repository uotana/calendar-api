import { pool } from '../../connection.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export async function login(request, response) {
     try {
          const { email, password } = request.body;

          const user = await pool.query(
               'SELECT * FROM users WHERE email = $1',
               [email]
          );

          const checkUser = user.rows[0];

          if (!checkUser) return response.status(400).json({
               status: 'error',
               message: 'Usuário não encontrado.'
          });

          const matchPassword = await bcrypt.compare(password, checkUser.password);

          if (!matchPassword) return response.status(400).json({
               status: 'error',
               message: 'Senha incorreta.'
          });

          const token = jwt.sign({
               id: checkUser.id,
               name: checkUser.name,
               email: checkUser.email
          }, 'calendarapi', {
               expiresIn: 60 * 5
          });

          return response.status(200).json({
               status: 'success',
               message: 'Logged in successfully.',
               token
          });
     } catch (error) {
          console.log(error);

          throw error;
     };
};