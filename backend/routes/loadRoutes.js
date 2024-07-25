import express from 'express'
const router = express.Router();
import { getLoads, getLoadsById, createLoad, updateLoadStatus, cancelOrDeleteLoad, updateLoad, getMyLoads } from '../controllers/loadController.js';
import { protect, admin, user, carrier } from '../middleware/authMiddleware.js'; 

router.route('/myloads').get(protect, getMyLoads)
router.route('/').get(protect, getLoads).post(protect, createLoad);
router.route('/:id')
  .get(protect, getLoadsById)
  .patch(protect, updateLoadStatus)
  .delete(protect, cancelOrDeleteLoad)
  .put(protect, updateLoad);

export default router;