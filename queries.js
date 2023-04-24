require('dotenv').config();

const Pool = require('pg-pool');
const url = require('url')

const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');

const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: true
};

const pool = new Pool(config);

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users', (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows)
    })
  }

  const getUserById = (request, response) => {
    const id = parseInt(request.params.user_id);
  
    pool.query('SELECT * FROM users WHERE user_id = $1', [id], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows)
    })
  }

  const createUser = (request, response) => {
    const { user_name, user_email } = request.body;
    console.log(user_name + ' : ' + user_email)
    pool.query('INSERT INTO users (user_name, user_email) VALUES ($1, $2) RETURNING user_id', [user_name, user_email], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`User added with ID: ${results.rows[0].user_id}`)
    })
  }

  const updateUser = (request, response) => {
    
    const { user_name, user_email } = request.body;
    const user_id = parseInt(request.params.user_id);
    console.log(user_id);

    pool.query(
      'UPDATE users SET user_name = $1, user_email = $2 WHERE user_id = $3 RETURNING user_id',
      [user_name, user_email, user_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(200).send(`User modified with ID: ${user_id}`)
      }
    )
  }

  const deleteUser = (request, response) => {
    const id = parseInt(request.params.user_id);
  
    pool.query('DELETE FROM users WHERE user_id = $1', [id], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User deleted with ID: ${id}`)
    })
  }


  ///////////////////////////////


  const getCalendars = (request, response) => {
    pool.query('SELECT * FROM calendars', (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows)
    })
  }

const getCalendarById = (request, response) => {
    const id = parseInt(request.params.calendar_id);
  
    pool.query('SELECT * FROM calendars WHERE calendar_id = $1', [id], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows)
    })
  }

const getCalendarByUserId = (request, response) => {
    const id = parseInt(request.params.user_id);
  
    pool.query('SELECT * FROM calendars WHERE user_id = $1', [id], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows)
    })
  }

const createCalendar = (request, response) => {
    pool.query('INSERT INTO calendar (user_id) VALUES ($1) RETURNING user_id', [user_id], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`Calendar added with ID: ${results.rows[0].calendar_id}`)
    })
  }

  module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    
    createCalendar,
    getCalendars,
    getCalendarById,
    getCalendarByUserId,
  }