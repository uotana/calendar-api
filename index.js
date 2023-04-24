const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries.js')
const port = 3000

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})

app.get('/users', db.getUsers);
app.get('/users/:user_id', db.getUserById);
app.post('/users', db.createUser);
app.put('/users/:user_id', db.updateUser);
app.delete('/users/:user_id', db.deleteUser);

app.get('/calendars', db.getCalendars)
app.get('/calendars/:calendar_id', db.getCalendarById)
app.get('/calendars/:user_id', db.getCalendarByUserId)
app.post('/calendars', db.createCalendar)