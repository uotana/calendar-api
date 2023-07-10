import { pool } from '../../connection.js';

// Busca todos os eventos
export async function getEvents(request, response) {
     try {
          const getEvents = await pool.query('SELECT * FROM events');

          if (getEvents) {
               const events = getEvents.rows;

               return response.status(200).json({ events });
          } else {
               return response.status(200).json([]);
          }
     } catch (error) {
          console.log(error);

          throw error;
     }
};

// Busca um evento em específico
export async function getEventById(request, response) {
     try {
          const id = parseInt(request.params.id);

          const getEvent = await pool.query('SELECT * FROM events WHERE id = $1', [id]);

          if (getEvent) {
               const event = getEvent.rows[0];

               return response.status(200).json({ event });
          } else {
               return response.status(400).json({
                    status: 'error',
                    message: 'Evento não encontrado.'
               });
          };
     } catch (error) {
          console.log(error);

          throw error;
     }
};

// Busca todos os eventos de uma agenda em específico
export async function getEventsByTagId(request, response) {
     try {
          const id = parseInt(request.params.id);

          const getEvents = await pool.query(
               `SELECT e.id, e.title, e.description, e.date
               FROM events e
               INNER JOIN markers em ON e.id = em.id
               INNER JOIN markers m ON em.marker_id = m.id
               WHERE m.id = $1`,
               [id]
          );

          if (getEvents) {
               const events = getEvents.rows;

               return response.status(200).json({ events });
          } else {
               return response.status(200).json([]);
          }
     } catch (error) {
          console.log(error);

          throw error;
     }
};

// Cria um evento
export async function createEvent(request, response) {
     try {
          const { user_id, title, description, date, tag_name } = request.body;

          if (!title) return response.status(400).json({
               status: 'error',
               message: 'O título é obrigatório.'
          });

          if (!description) return response.status(400).json({
               status: 'error',
               message: 'A descrição é obrigatória.'
          });

          if (!date) return response.status(400).json({
               status: 'error',
               message: 'A data é obrigatória.'
          });

          const eventDate = new Date(date);

          const event = await pool.query(
               `INSERT INTO events (user_id, title, description, date)
               VALUES ($1, $2, $3, $4)
               RETURNING id`,
               [user_id, title, description, eventDate]
          );

          if (event.rows[0].id) {
               const getTag = await pool.query(
                    'SELECT id FROM tags WHERE name = $1',
                    [tag_name]
               );

               const associateEventToTag = await pool.query(
                    'INSERT INTO event_tags (event_id, tag_id) VALUES ($1, $2)',
                    [event.rows[0].id, getTag.rows[0].id]
               );

               if (associateEventToTag) {
                    return response.status(201).json({
                         status: 'success',
                         message: 'Evento criado com sucesso.'
                    });
               };
          } else {
               return response.status(201).json({
                    status: 'error',
                    message: 'Ocorreu um erro ao criar o evento.'
               });
          };
     } catch (error) {
          console.log(error);

          throw error;
     }
};

// Atualiza um evento existente
export async function updateEvent(request, response) {
     try {
          const { title, description } = request.body;

          if (!title) return response.status(400).json({
               status: 'error',
               message: 'O título é obrigatório.'
          });

          if (!description) return response.status(400).json({
               status: 'error',
               message: 'A descrição é obrigatória.'
          });

          const id = parseInt(request.params.id);

          const getEvent = await pool.query(
               'SELECT * FROM events WHERE id = $1',
               [id]
          );

          if (getEvent.rows.length === 0) return response.status(400).json({
               status: 'error',
               message: 'Evento não encontrado.'
          });

          const event = await pool.query(
               'UPDATE events SET title = $1, description = $2 WHERE id = $3 RETURNING id',
               [title, description, id]
          );

          if (event) {
               return response.status(200).json({
                    status: 'success',
                    message: 'Evento atualizado com sucesso.'
               });
          } else {
               return response.status(400).json({
                    status: 'error',
                    message: 'Ocorreu um erro ao atualizar o evento.'
               });
          };
     } catch (error) {
          console.log(error);

          throw error;
     }
};

// Exclui um evento existente
export async function deleteEvent(request, response) {
     try {
          const id = parseInt(request.params.id);

          const event = await pool.query(
               'SELECT * FROM events WHERE id = $1',
               [id]
          );

          if (!event) return response.status(400).json({
               status: 'error',
               message: 'Evento não encontrado.'
          });

          await pool.query(
               'DELETE FROM events WHERE id = $1',
               [id]
          );

          return response.status(200).json({
               message: 'O evento foi excluído com sucesso.'
          });
     } catch (error) {
          console.log(error);

          throw error;
     }
};