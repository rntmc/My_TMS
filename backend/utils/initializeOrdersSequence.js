// initializeSequence.js
import mongoose from 'mongoose';
import OrderSequence from '../models/orderSequenceModel.js';

const uri = process.env.MONGO_URI;

const initializeOrdersSequence = async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Initialize the sequence with a starting value of 20000 if it does not exist
    await OrderSequence.updateOne(
      { _id: 'orderNumber' },
      { $setOnInsert: { currentValue: 30000 } },
      { upsert: true }
    );

    console.log('Order Sequence initialized or updated with starting value 20000');
  } catch (error) {
    console.error('Error initializing order sequence:', error);
  } finally {
    await mongoose.connection.close();
  }
};

initializeOrdersSequence();
