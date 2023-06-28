import express from 'express';
import cors from 'cors';

import usersRouter from './src/routes/users.routes.js';
import calendarsRouter from './src/routes/calendars.routes.js';
import eventsRouter from './src/routes/events.routes.js';
import tagsRouter from './src/routes/tags.routes.js';

// Cria um servidor usando o Express
const app = express();

// Configurações do servidor
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Declara as rotas e os arquivos relacionados
app.use('/users', usersRouter);
app.use('/calendars', calendarsRouter);
app.use('/events', eventsRouter);
app.use('/tags', tagsRouter);

app.listen(3000, () => {
     console.log(`App running on http://localhost:${3000}.`);
});