import express from 'express';
import {
    getTest,
    getSlow,
    postTest,
    putTest,
    patchTest,
    deleteTest,
    dbTest,
} from '../controllers/controller.js';

const router = express.Router();

router.get('/', getTest);
router.get('/slow', getSlow);
router.post('/test', postTest);
router.put('/test', putTest);
router.patch('/test', patchTest);
router.delete('/test', deleteTest);
router.get('/dbtest', dbTest);

export default router;
