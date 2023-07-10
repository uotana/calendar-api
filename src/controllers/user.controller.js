import { pool } from '../../connection.js';
import bcrypt from 'bcrypt';

const salt = 10;

// Lista todos os usuários
export async function getUsers(request, response) {
     try {
          const query = await pool.query('SELECT * FROM users');

          if (query) {
               const users = query.rows;

               users.map((user) => {
                    delete user.password;
                    delete user.created_at;
               });

               return response.status(200).json({ users });
          } else {
               return response.status(200).json([]);
          };
     } catch (error) {
          console.log(error);
          throw error;
     };
};

// Seleciona um usuário em específico
export async function getUserById(request, response) {
     try {
          const id = parseInt(request.params.id);

          const foundUser = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

          if (foundUser) {
               const user = foundUser.rows[0];

               delete user.password;

               return response.status(200).json({ user });
          } else {
               return response.status(400).json({
                    status: 'error',
                    message: 'Usuário não encontrado.'
               })
          };
     } catch (error) {
          console.log(error);

          throw error;
     };
};

// Cria um novo usuário
export async function createUser(request, response) {
     try {
          const { name, email, password } = request.body;

          if (!name) return response.status(400).json({
               status: 'error',
               message: 'O nome é obrigatório.'
          });

          if (!email) return response.status(400).json({
               status: 'error',
               message: 'O e-mail é obrigatório.'
          });

          if (!password) return response.status(400).json({
               status: 'error',
               message: 'A senha é obrigatória.'
          });

          const hash = await bcrypt.hash(password, salt);

          const newUser = await pool.query(
               'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name',
               [name, email, hash]
          );

          if (newUser) {
               const data = {
                    user_id: newUser.rows[0].id,
                    name: `Eventos de ${newUser.rows[0].name}`
               };

               const newTag = await pool.query(
                    'INSERT INTO tags (user_id, name) VALUES ($1, $2) RETURNING id',
                    [data.user_id, data.name]
               );

               if (newTag) {
                    return response.status(200).json({
                         status: 'success',
                         message: 'Usuário criado com sucesso.'
                    });
               };
          } else {
               return response.status(400).json({
                    status: 'error',
                    message: 'Ocorreu um erro na criação do usuário.'
               });
          };
     } catch (error) {
          console.log(error);

          throw error;
     };
};

// Atualiza um usuário existente
export async function updateUser(request, response) {
     try {
          const { name, email, password, newPassword } = request.body;

          const id = parseInt(request.params.id);

          const user = await pool.query(
               'SELECT * FROM users WHERE id = $1',
               [id]
          );

          console.log(user);

          if (user.rows.length === 0) return response.status(400).json({
               status: 'error',
               message: 'Usuário não encontrado.'
          });

          const checkUser = user.rows[0];

          const matchPassword = await bcrypt.compare(password, checkUser.password);

          if (!matchPassword) return response.status(400).json({
               status: 'error',
               message: 'Senha incorreta.'
          });

          const hash = await bcrypt.hash(newPassword, salt);

          const updatedUser = await pool.query(
               'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING id',
               [name, email, hash, id]
          );

          if (updatedUser) {
               return response.status(200).json({
                    status: 'success',
                    message: 'Usuário alterado com sucesso.'
               });
          } else {
               return response.status(400).json({
                    status: 'error',
                    message: 'Ocorreu um erro ao alterar os dados do usuário.'
               });
          };
     } catch (error) {
          console.log(error);

          throw error;
     }
};

// Exclui um usuário existente
export async function deleteUser(request, response) {
     try {
          const id = parseInt(request.params.id);

          const user = await pool.query(
               'SELECT * FROM users WHERE id = $1',
               [id]
          );

          if (!user) return response.status(400).json({
               status: 'error',
               message: 'Usuário não encontrado.'
          });

          await pool.query(
               'DELETE FROM users WHERE id = $1',
               [id]
          );

          return response.status(200).json({
               message: 'O usuário foi excluído com sucesso.'
          });
     } catch (error) {
          console.log(error);

          throw error;
     }
};