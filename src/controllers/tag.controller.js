import { pool } from '../../connection.js';

// Busca todos os marcadores
export async function getTags(request, response) {
     try {
          const getTags = await pool.query('SELECT * FROM tags');

          if (getTags) {
               const tags = getTags.rows;

               return response.status(200).json({ tags });
          } else {
               return response.status(200).json([]);
          };
     } catch (error) {
          console.log(error);

          throw error;
     };
};

// Cria um novo marcador
export async function createTag(request, response) {
     try {
          const { user_id, name } = request.body;

          if (!user_id) return response.status(400).json({
               status: 'error',
               message: 'O ID de um usuário é obrigatório.'
          });

          if (!name) return response.status(400).json({
               status: 'error',
               message: 'O nome do marcador é obrigatório.'
          });

          const tag = await pool.query(
               'INSERT INTO tags (user_id, name) VALUES ($1, $2) RETURNING id',
               [user_id, name]
          );

          if (tag.rows[0].id) {
               return response.status(200).json({
                    status: 'success',
                    message: 'O marcador foi criado com sucesso.'
               });
          };
     } catch (error) {
          console.log(error);

          throw error;
     }
};

// Atualiza um marcador existente
export async function updateTag(request, response) {
     try {
          const { name } = request.body;

          const id = parseInt(request.params.id);

          const getTag = await pool.query(
               'SELECT * FROM tags WHERE id = $1',
               [id]
          );

          if (getTag.rows.length === 0) return response.status(400).json({
               status: 'error',
               message: 'Marcador não encontrado.'
          });

          const updatedTag = await pool.query(
               'UPDATE tags SET name = $1 WHERE id = $2 RETURNING id',
               [name, id]
          );

          if (updatedTag) {
               return response.status(200).json({
                    message: 'O marcador foi atualizado com sucesso.'
               });
          };
     } catch (error) {
          console.log(error);

          throw error;
     }
};

// Exclui um marcador existente
export async function deleteTag(request, response) {
     try {
          const id = parseInt(request.params.id);

          const getTag = await pool.query(
               'SELECT * FROM tags WHERE id = $1',
               [id]
          );

          if (getTag.rows.length === 0) return response.status(400).json({
               status: 'error',
               message: 'Marcador não encontrado.'
          });

          await pool.query('DELETE FROM tags WHERE id = $1', [id]);

          return response.status(200).json({
               message: 'O marcador foi excluído com sucesso.'
          });
     } catch (error) {
          console.log(error);

          throw error;
     }
};