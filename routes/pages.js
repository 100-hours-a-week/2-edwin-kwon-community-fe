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

router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/signup.html'));
});

router.get('/posts/make', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/makepost.html'));
});

router.get('/posts/:post_id', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/post.html'));
});

router.get('/editprofile', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/editProfile.html'));
});

router.get('/editpassword', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/editPassword.html'));
});

router.get('/posts/:post_id/editpost', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/editPost.html'));
});

export default router;
