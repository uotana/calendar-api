import dotenv from 'dotenv';
import Pool from 'pg-pool';
import url from 'node:url';

dotenv.config();

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

export const pool = new Pool(config);