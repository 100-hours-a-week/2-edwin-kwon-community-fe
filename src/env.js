import dotenv from 'dotenv';

dotenv.config();

const apiVersion = 'v1';
const API_BASE_URL = `http://${process.env.HOST}:8000/api/${apiVersion}`;
const PUBLIC_URL = `http://${process.env.HOST}:8000/public`;

export { API_BASE_URL, PUBLIC_URL };
