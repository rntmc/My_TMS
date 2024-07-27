// initializeSequence.js
import mongoose from 'mongoose';
import LoadSequence from '../models/loadSequenceModel.js';

const uri = process.env.MONGO_URI;

const initializeLoadsSequence = async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Initialize the sequence with a starting value of 1000 if it does not exist
    await LoadSequence.updateOne(
      { _id: 'loadNumber' },
      { $setOnInsert: { currentValue: 1002 } },
      { upsert: true }
    );

    console.log('Order Sequence initialized or updated with starting value 1000');
  } catch (error) {
    console.error('Error initializing order sequence:', error);
  } finally {
    await mongoose.connection.close();
  }
};

initializeLoadsSequence();
