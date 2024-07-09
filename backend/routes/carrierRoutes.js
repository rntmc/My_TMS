import express from 'express'
const router = express.Router();
import {   
  registerCarrier,
  getCarriers
} from '../controllers/carrierController.js';

router.route('/')
  .post(registerCarrier)
  .get(getCarriers)

  export default router;