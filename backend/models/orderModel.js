import mongoose from "mongoose";
import addressSchema from './addressModel.js';

const orderSchema = new mongoose.Schema({
  orderId: {
    type: Number,
    unique: true,
    required: true,
  },
  pickupDate: {
    type: Date,
    required: true
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  origin: {
    supplierNumber: {
      type: Number,
      required: true
    },
    supplierName: {
      type: String,
      required: true
    },
    supplierLocation: addressSchema
  },
  destination: {
    plantNumber: {
      type: Number,
      required: true
    },
    plantName: {
      type: String,
      required: true
    },
    plantLocation: addressSchema
  },
  packageQty: {
    type: Number,
    required: true
  },
  length: {
    type: Number,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  volume: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  freightCost: {
    type: Number,
    required: true
  },
  productId: {
    type: String,
    required: true
  },
  productQuantity: {
    type: Number,
    required: true
  },
  dangerousGoods: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  
  },
}, {
  timestamps: true 
});

const Order = mongoose.model("Order", orderSchema);

export default Order;