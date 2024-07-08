import express from 'express'
const router = express.Router();
import { getOrders, getOrderById, createOrder, getMyOrders } from '../controllers/orderController.js';
import { protect, admin, user, carrier } from '../middleware/authMiddleware.js'; 

router.route('/myorders').get(protect, user, getMyOrders)
router.route('/').get(protect, getOrders).post(protect, createOrder);
router.route('/:id').get(protect, getOrderById);

export default router;