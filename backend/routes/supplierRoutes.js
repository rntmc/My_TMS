import express from 'express'
const router = express.Router();
import {   
  registerSupplier,
  getSuppliers,
  deleteSupplier,
} from '../controllers/supplierController.js';

router.route('/')
  .post(registerSupplier)
  .get(getSuppliers)
  router.route('/:id')
  .delete(deleteSupplier)

  export default router;