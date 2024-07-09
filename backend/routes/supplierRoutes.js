import express from 'express'
const router = express.Router();
import {   
  registerSupplier,
  getSuppliers,
} from '../controllers/supplierController.js';

router.route('/')
  .post(registerSupplier)
  .get(getSuppliers)

  export default router;