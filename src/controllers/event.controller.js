import { pool } from '../../connection.js';

// Busca todos os eventos
export async function getEvents(request, response) {
     try {
          const events = await pool.query('SELECT * FROM events');

          return response.status(200).json({ events });
     } catch (error) {
          console.log(error);

          throw error;
     }
};

// Busca um evento em específico
export async function getEventById(request, response) {
     try {
          const id = parseInt(request.params.event_id);

          const event = await pool.query('SELECT * FROM events WHERE event_id = $1', [id]);

          return response.status(200).json({ event });
     } catch (error) {
          console.log(error);

          throw error;
     }
};

// Busca todos os eventos de uma agenda em específico
export async function getEventsByCalendarId(request, response) {
     try {
          const id = parseInt(request.params.calendar_id);

          const events = pool.query('SELECT * FROM events WHERE calendar_id = $1', [id]);

          return response.status(200).json({ events });
     } catch (error) {
          console.log(error);

          throw error;
     }
};

// Cria um evento
export async function createEvent(request, response) {
     try {
          const { event_title, event_description, event_tag } = request.body;

          const event = await pool.query('INSERT INTO events (event_title, event_description, event_tag) VALUES ($1, $2) RETURNING *', [event_title, event_description, event_tag]);

          return response.status(201).json({
               message: 'Evento criado com sucesso.',
               data: {
                    event
               }
          });
     } catch (error) {
          console.log(error);

          throw error;
     }
};

// Atualiza um evento existente
export async function updateEvent(request, response) {
     try {
          const { event_title, event_description, event_tag } = request.body;

          const event_id = parseInt(request.params.event_id);

          const event = await pool.query('UPDATE events SET event_title = $1, event_description = $2, event_tag=$3 WHERE event_id=$4 RETURNING *', [event_title, event_description, event_tag, event_id]);
          
          return response.status(200).json({
               message: 'Evento atualizado com sucesso',
               data: {
                    event
               }
          });
     } catch (error) {
          console.log(error);

          throw error;
     }
};

// Exclui um evento existente
export async function deleteEvent(request, response) {
     try {
          const event_id = parseInt(request.params.event_id);

          await pool.query('DELETE FROM events WHERE event_id = $1', [event_id]);
          
          return response.status(200).json({
               message: 'O evento foi excluído com sucesso.'
          });
     } catch (error) {
          console.log(error);

          throw error;
     }
};