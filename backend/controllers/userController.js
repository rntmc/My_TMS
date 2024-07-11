import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js';

// @Desc Auth user & get token
// @ route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const {email, password} = req.body;

  //checking valid email & password
  const user = await User.findOne({ email});

  if(user && (await user.matchPassword(password))) {
    generateToken(res, user._id)

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    })
  } else {
    res.status(401);
    throw new Error('Invalid email or password')
  }
})

// @Desc Register user
// @ route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const {name, email, password, role} = req.body;

  const userExist = await User.findOne({ email })

  if (userExist) {
    res.status(400);
    throw new Error('User already exists')
  }

  const user = await User.create({
    name,
    email,
    password,
    role
  });

  if(user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    })
  } else {
    res.status(400);
    throw new Error('Invalid user data')
  }

})

// @Desc Logout user / clear cookie
// @ route GET /api/users/logout
// @access Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({message: 'Logged out successfully'})
})

// @Desc Get user profile
// @ route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if(user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    })
  } else {
    res.status(404);
    throw new Error('User not found')
  }
})

// @Desc Update user profile
// @ route PUT /api/users/profile - not using /:id because we are using token, so only have access to its own data
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    
    if (req.body.password) {
      user.password = req.body.password;
    } 
    const updateUser = await user.save();

    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      password: updateUser.password,
    })
  } else {
    res.status(404);
    throw new Error('User not found')
  }
})

// @Desc Get users
// @ route GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users)
});

// @Desc Get user by ID
// @ route GET /api/users/:id
// @access Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if(user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('User not found')
  }
})

// @Desc Delete users
// @ route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if(user) {
    if(user.role === "Admin"){
      res.status(400);
      throw new Error('Cannot delete admin users')
    }
    await User.deleteOne({_id: user._id})
    res.status(200).json({message: 'User deleted successfully'});
  } else {
    res.status(404);
    throw new Error('User not found')
  }
})

// @Desc update user
// @ route DELETE /api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if(user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.role = req.body.role || user.role

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found')
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser
}