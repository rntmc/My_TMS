import jwt from 'jsonwebtoken'
import asyncHandler from './asyncHandler.js'
import User from '../models/userModel.js'

//Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read JWT from cookie
  token = req.cookies.jwt

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password') //exclude password
      console.log(req.user)
      next();
    } catch {
      console.log(error)
      res.status(401);
      throw new Error('Not authorized, token failed')
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token')
  }
})

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as admin')
  } 
};

// User middleware
const user = (req, res, next) => {
  if (req.user && req.user.role === "User") {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized')
  } 
};

// Carrier middleware
const carrier = (req, res, next) => {
  if (req.user && req.user.role === "Carrier") {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as Carrier')
  } 
};

export {protect, admin, user, carrier};