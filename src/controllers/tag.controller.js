import { pool } from '../../connection.js';

// Busca todos os marcadores
export async function getTags(request, response) {
     try {
          const tags = pool.query('SELECT * FROM tags');

          return response.status(200).json({ tags });
     } catch (error) {
          console.log(error);

          throw error;
     };
};