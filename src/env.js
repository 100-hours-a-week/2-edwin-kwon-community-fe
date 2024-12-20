const PORT = 3000;
const HOST = 'localhost';
const apiVersion = 'v1';

const BACKEND_URL = `http://${HOST}:8000`;
const API_BASE_URL = `http://${HOST}:8000/api/${apiVersion}`;
const PUBLIC_URL = `http://${HOST}:8000/public`;

export { BACKEND_URL, API_BASE_URL, PUBLIC_URL, PORT, HOST };
