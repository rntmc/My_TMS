import express from 'express'
const router = express.Router();
import {   
  registerEntity,
  getEntities,
  deleteEntity,
  getEntityById,
  updateEntity,
  getEntityByNumber
} from '../controllers/entityController.js';

router.route('/')
  .post(registerEntity)
  .get(getEntities)
router.route('/:id')
  .delete(deleteEntity)
  .get(getEntityById)
  .put(updateEntity)
router.route('/number/:entityNumber')
  .get(getEntityByNumber);

  export default router;