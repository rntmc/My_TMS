import express from 'express'
const router = express.Router();
import { getLoads, getLoadsById } from '../controllers/loadController.js';
import { protect, admin, user, carrier } from '../middleware/authMiddleware.js'; 

router.route('/').get(protect, getLoads);
router.route('/:id').get(protect, getLoadsById);

export default router;