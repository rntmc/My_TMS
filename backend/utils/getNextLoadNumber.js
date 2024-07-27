import LoadSequence from '../models/loadSequenceModel.js'; // Adjust the path as necessary

const getNextLoadNumber = async () => {
  try {
    // Find and update the sequence document atomically
    const result = await LoadSequence.findOneAndUpdate(
      { _id: 'loadNumber' },
      { $inc: { currentValue: 1 } },
      { new: true, upsert: true }
    );

    return result.currentValue; // Return the updated value
  } catch (error) {
    console.error('Error updating load sequence:', error);
    throw new Error('Failed to get the next order number');
  }
};

export default getNextLoadNumber;
