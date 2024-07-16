import mongoose from "mongoose";
import dotenv from 'dotenv';
import colors from 'colors';
import users from './data/users.js';
import entities from './data/entities.js';
import orders from './data/orders.js';
import loads from './data/loads.js';
import carriers from './data/carriers.js';
import User from './models/userModel.js';
import Entity from './models/entityModel.js';
import Order from './models/orderModel.js';
import Carrier from './models/carrierModel.js';
import Load from "./models/loadModel.js";
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Carrier.deleteMany();
    await User.deleteMany();
    await Entity.deleteMany();
    await Load.deleteMany();

    const createdEntities = await Entity.insertMany(entities);
    const createdUsers = await User.insertMany(users);
    const createdCarriers = await Carrier.insertMany(carriers);
    
    const adminUser = createdUsers.find(user => user.role[0]);
    
    const sampleOrders = orders.map((order) => {
      const { origin, destination, ...restOrder } = order;

      return {
        ...restOrder, 
        user: adminUser._id,
        origin: { ...origin },
        destination: { ...destination }
      }
    })
    
    const createdOrders = await Order.insertMany(sampleOrders);
    
    const sampleLoads = loads.map((load) => {
      const carrier = createdCarriers.find(carrier => carrier.carrierNumber === load.carrierNumber);
      const orderIds = load.orders.map(OrderNumber => {
        const order = createdOrders.find(order => order.orderNumber[0] === OrderNumber[0]);
        return order;
      });

      return {
        ...load,
        carrier: carrier._id,
        orders: orderIds,
        user: adminUser._id, // Associando a carga ao usuário administrador
      };
    });

    await Load.insertMany(sampleLoads);

    console.log('Data Imported'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
}

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Load.deleteMany();
    await User.deleteMany();
    await Carrier.deleteMany();
    await Entity.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
}

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}