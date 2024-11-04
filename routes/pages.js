import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// 메인 페이지
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

router.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/signin.html'));
});

router.get('/makepost', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/makepost.html'));
});

router.get('/post/:post_id', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/post.html'));
});

router.get('/editprofile', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/editProfile.html'));
});

export default router;
