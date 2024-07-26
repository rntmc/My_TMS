// initializeSequence.js
import mongoose from 'mongoose';
import Sequence from '../models/sequenceModel.js';

const uri = process.env.MONGO_URI;

const initializeOrdersSequence = async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Initialize the sequence with a starting value of 20000 if it does not exist
    await Sequence.updateOne(
      { _id: 'orderNumber' },
      { $setOnInsert: { currentValue: 30000 } },
      { upsert: true }
    );

    console.log('Sequence initialized or updated with starting value 20000');
  } catch (error) {
    console.error('Error initializing sequence:', error);
  } finally {
    await mongoose.connection.close();
  }
};

initializeOrdersSequence();
