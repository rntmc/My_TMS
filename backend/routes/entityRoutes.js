import express from 'express'
const router = express.Router();
import {   
  registerEntity,
  getEntities,
  deleteEntity,
  getEntityById,
  updateEntity,
} from '../controllers/entityController.js';

router.route('/')
  .post(registerEntity)
  .get(getEntities)
router.route('/:id')
  .delete(deleteEntity)
  .get(getEntityById)
  .put(updateEntity)

  export default router;