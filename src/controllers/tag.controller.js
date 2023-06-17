import { pool } from '../../connection.js';

// Busca todos os marcadores
export async function getTags(request, response) {
     try {
          const tags = await pool.query('SELECT * FROM tags');
          console.log(tags);
          return response.status(200).json({ tags });
     } catch (error) {
          console.log(error);

          throw error;
     };
};

// Seleciona um marcador em específico
export async function getTagById(request, response) {
     try {
          const id = parseInt(request.params.tag_id);

          const tag = await pool.query('SELECT * FROM tags WHERE tag_id = $1', [id]);

          return response.status(200).json({ tag });
     } catch (error) {
          console.log(error);

          throw error;
     };
};

// Cria um novo marcador
export async function createTag(request, response) {
     try {
          const { tag_name } = request.body;

          const id = await pool.query('INSERT INTO tags (tag_name) VALUES ($1) RETURNING tag_id', [tag_name]);

          if (id) {
               return response.status(200).json({
                    message: 'O marcador foi criado com sucesso.',
                    data: {
                         id
                    }
               });
          }
     } catch (error) {
          console.log(error);

          throw error;
     }
};

// Atualiza um marcador existente
export async function updateTag(request, response) {
     try {
          const { tag_name } = request.body;

          const id = parseInt(request.params.tag_id);

          const tagId = await pool.query(
               'UPDATE tags SET tag_name = $1 WHERE tag_id = $2 RETURNING tag_id',[tag_name, id]
          );

          if (tagId) {
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
          const id = parseInt(request.params.tag_id);

          await pool.query('DELETE FROM tags WHERE tag_id = $1', [id]);

          return response.status(200).json({
               message: 'O marcador foi excluído com sucesso.'
          });
     } catch (error) {
          console.log(error);

          throw error;
     }
};