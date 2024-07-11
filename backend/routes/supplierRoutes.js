import express from 'express'
const router = express.Router();
import {   
  registerSupplier,
  getSuppliers,
  deleteSupplier,
  getSupplierById,
  updateSupplier,
} from '../controllers/supplierController.js';

router.route('/')
  .post(registerSupplier)
  .get(getSuppliers)
router.route('/:id')
  .delete(deleteSupplier)
  .get(getSupplierById)
  .put(updateSupplier)

  export default router;