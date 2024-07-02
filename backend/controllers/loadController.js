import asyncHandler from '../middleware/asyncHandler.js';
import Load from '../models/loadModel.js'

// @Desc Fetch all loads
// @ route GET /api/loads
// @access Public
const getLoads = asyncHandler(async (req, res) => {
  const loads = await Load.find({})
  res.json(loads)
})

// @Desc Fetch a load
// @ route GET /api/loads/:id
// @access Public
const getLoadsById = asyncHandler(async (req, res) => {
  const load = await Load.findById(req.params.id)

  if(load) {
    res.json(load)
  } else {
    res.status(404)
    throw new Error('Resource not found')
  }
})

export {getLoadsById, getLoads}