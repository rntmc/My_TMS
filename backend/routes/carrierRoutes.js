import express from 'express'
const router = express.Router();
import {   
  registerCarrier,
  getCarriers,
  deleteCarrier,
  getCarrierById,
  updateCarrier
} from '../controllers/carrierController.js';

router.route('/')
  .post(registerCarrier)
  .get(getCarriers)
  router.route('/:id')
  .delete(deleteCarrier)
  .get(getCarrierById)
  .put(updateCarrier)

  export default router;