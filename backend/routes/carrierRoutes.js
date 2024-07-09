import express from 'express'
const router = express.Router();
import {   
  registerCarrier,
  getCarriers,
  deleteCarrier,
} from '../controllers/carrierController.js';

router.route('/')
  .post(registerCarrier)
  .get(getCarriers)
  router.route('/:id')
  .delete(deleteCarrier)

  export default router;