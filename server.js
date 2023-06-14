import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/users';

dotenv.config();

const port = process.env.PORT | 5000;

// Cria um servidor usando o Express
const app = express();

// Configurações do servidor
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Declara as rotas e os arquivos relacionados
app.use('/users', userRoutes);
app.use('/calendars', calendarsRoutes);
app.use('/events', eventsRoutes);
app.use('/tags', tagsRoutes);

app.listen(port, () => {
     console.log(`App running on http://localhost:${port}.`);
});