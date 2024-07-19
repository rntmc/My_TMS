import express from 'express'
const router = express.Router();
import { getOrders, getOrderById, createOrder, getMyOrders,updateOrderStatus, cancelOrDeleteOrder, updateOrder } from '../controllers/orderController.js';
import { protect, admin, user, carrier } from '../middleware/authMiddleware.js'; 

router.route('/myorders').get(protect, getMyOrders)
router.route('/').get(protect, getOrders).post(protect, createOrder);
router.route('/:id')
  .get(protect, getOrderById)
  .patch(protect, updateOrderStatus)
  .delete(protect, cancelOrDeleteOrder)
  .put(protect, updateOrder);

export default router;