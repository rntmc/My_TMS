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
  packages: [
    {
      packageQty: Number,
      length: Number,
      width: Number,
      height: Number,
      volume: Number,
      weight: Number,
    }
  ],
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
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',  
    required: true
  }
}, {
  timestamps: true 
});

// Pré-save hook para calcular automaticamente o volume
orderSchema.pre('save', function(next) {
  // Calcula o volume apenas se length, width e height estiverem definidos
  if (this.packageQty && this.length && this.width && this.height) {
    this.volume = this.length * this.width * this.height * this.packageQty;
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;