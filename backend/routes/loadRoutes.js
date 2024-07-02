import express from 'express'
const router = express.Router();
import { getLoads, getLoadsById } from '../controllers/loadController.js';

router.route('/').get(getLoads);
router.route('/:id').get(getLoadsById);

export default router;