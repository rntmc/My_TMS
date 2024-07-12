import express from 'express'
const router = express.Router();
import { getLoads, getLoadsById, createLoad, updateLoadStatus } from '../controllers/loadController.js';
import { protect, admin, user, carrier } from '../middleware/authMiddleware.js'; 

router.route('/').get(protect, getLoads).post(protect, createLoad);
router.route('/:id').get(protect, getLoadsById).patch(protect, updateLoadStatus);

export default router;