import { pool } from '../../connection';

// Lista todos os usuários
export async function getUsers(request, response) {
     try {
          const query = await pool.query('SELECT * FROM users');

          if (query) return response.status(200).json({ query });
     } catch (error) {
          console.log(error);
          throw error;
     };
};

// Seleciona um usuário em específico
export async function getUserById(request, response) {
     try {
          const id = parseInt(request.params.user_id);

          const user = pool.query('SELECT * FROM users WHERE user_id = $1', [id]);

          return response.status(200).json({ user });
     } catch (error) {
          console.log(error);

          throw error;
     };
};

// Cria um novo usuário
export async function createUser(request, response) {
     try {
          const { user_name, user_email } = request.body;

          const userId = pool.query('INSERT INTO users (user_name, user_email) VALUES ($1, $2) RETURNING user_id', [user_name, user_email]);

          if (userId) {
               return response.status(200).json({
                    message: 'Usuário criado com sucesso.',
                    data: {
                         userId
                    }
               });
          } else { }
     } catch (error) {

     }
};

// Atualiza um usuário existente
export async function updateUser(request, response) {
     try {
          const { user_name, user_email } = request.body;

          const user_id = parseInt(request.params.user_id);

          const userId = await pool.query(
               'UPDATE users SET user_name = $1, user_email = $2 WHERE user_id = $3 RETURNING user_id',
               [user_name, user_email, user_id]
          );

          if (userId) {
               return response.status(200);
          } else { };
     } catch (error) {
          console.log(error);

          throw error;
     }
};

// Exclui um usuário existente
export async function deleteUser(request, response) {
     try {
          const id = parseInt(request.params.user_id);

          await pool.query('DELETE FROM users WHERE user_id = $1', [id]);

          return response.status(200).json({
               message: 'O usuário foi excluído com sucesso.'
          });
     } catch (error) {
          console.log(error);

          throw error;
     }
};