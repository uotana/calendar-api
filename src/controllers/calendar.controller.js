import { pool } from '../../connection';

// Seleciona todas as agendas
export async function getCalendars(request, response) {
     try {
          const calendars = pool.query('SELECT * FROM calendars');

          return response.status(200).json({ calendars });
     } catch (error) {
          console.log(error);

          throw error;
     };
};

// Seleciona uma agenda em específico
export async function getCalendarById(request, response) {
     try {
          const id = parseInt(request.params.calendar_id);

          const calendar = pool.query('SELECT * FROM calendars WHERE calendar_id = $1', [id]);

          return response.status(200).json({ calendar });
     } catch (error) {
          console.log(error);

          throw error;
     };
};

// Seleciona uma agenda de um usuário em específico
export async function getCalendarByUserId(request, response) {
     try {
          const id = parseInt(request.params.user_id);

          const calendars = pool.query('SELECT * FROM calendars WHERE user_id = $1', [id]);
          
          return response.status(200).json({ calendars });
     } catch (error) {
          console.log(error);

          throw error;
     };
};

// Cria uma agenda para um usuário
export async function createCalendar(request, response) {
     try {
          const user_id = parseInt(request.params.user_id);

          const userId = await pool.query('INSERT INTO calendar (user_id) VALUES ($1) RETURNING user_id', [user_id]);

          if (userId) {
               return response.status(200).json({
                    message: 'Agenda criada com sucesso.',
                    data: {
                         userId
                    }
               });
          } else {
               return response.status(400).json({
                    message: 'Não foi possível criar uma agenda. Tente novamente.'
               });
          }
     } catch (error) {
          console.log(error);

          throw error;
     };
};