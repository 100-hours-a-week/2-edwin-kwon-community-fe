import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pageRoutes from './routes/pages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 정적 파일 제공
app.use(express.static('public'));
app.use('/src', express.static(path.join(__dirname, 'src')));

// body parser 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트 설정
app.use('/', pageRoutes);

// 404 에러 핸들링
app.use((req, res) => {
    res.status(404).send('Not Found');
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Frontend server is running on http://localhost:${PORT}`);
});
