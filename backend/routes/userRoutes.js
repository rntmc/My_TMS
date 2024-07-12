import express from 'express'
const router = express.Router();
import {   
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/userController.js';
import {protect, admin} from '../middleware/authMiddleware.js'

router.route('/')
  .post(registerUser)
  .get(protect, getUsers);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)

router.route('/:id')
  .delete(protect, deleteUser)
  .get(protect, getUserById)
  .put(protect, updateUser)
  
  
router.post('/logout', logoutUser);
router.post('/auth', authUser);

export default router;