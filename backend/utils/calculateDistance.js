import axios from 'axios'

const calculateDistance = async ({origin, destination}) => {
  const apiKey = process.env.GOOGLE_API_KEY; 

  try {
    // Ensure that origin and destination are defined and not empty
    if (!origin || !destination) {
      throw new Error('Origin and destination must be provided');
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
      params: {
        origins: origin,
        destinations: destination,
        key: apiKey
      }
    });

    if (response.data.status === 'OK' && response.data.rows.length > 0 && response.data.rows[0].elements.length > 0) {
      const distanceInMeters = response.data.rows[0].elements[0].distance.value;
      const distanceInKm = distanceInMeters / 1000; // Convert meters to kilometers
      const distanceInKmRounded = Math.round(distanceInKm); // Round to the nearest integer
      return distanceInKmRounded;
    } else {
      throw new Error('Invalid response from API: ' + response.data.status);
    }
  } catch (error) {
    console.error('Error fetching distance:', error.message);
    throw new Error('Failed to calculate distance');
  }
};

export default calculateDistance;
