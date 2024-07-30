const validateAddress = async (location) => {
  const apiKey=process.env.GOOGLE_API_KEY
  const locationString = `${location.address}, ${location.city}, ${location.state}, ${location.postcode}, ${location.country}`;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationString)}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Address validation error: Unsuccessful response from Google API.');
    }
    const data = await response.json();

    console.log('Response from Google Maps Geocoding API:', data);

    // Check if response status is "OK"
    if (data.status === 'OK') {
      // Check if there are results
      if (data.results.length > 0) {
        // Check formatted address
        const formattedAddress = data.results[0].formatted_address.toLowerCase();
        console.log('formattedAddress from API:', formattedAddress);

        // Address provided by the user
        const fullAddress = `${location.address}, ${location.city}, ${location.state} ${location.postcode}, ${location.country}`;
        const providedAddress = fullAddress.toLowerCase();
        console.log("ProvidedAddress:", providedAddress)

        // Compare addresses
        if (formattedAddress.toLowerCase() === providedAddress.toLowerCase()) {
          return data;
        } else {
          throw new Error('Invalid address. Please check and try again.');
        }
      } else {
        throw new Error('No results found for the provided address.');
      }
    } else {
      throw new Error(`Response status: ${data.status}`);
    }
  } catch (error) {
    throw new Error(`Validation address error: ${error.message}`);
  }
};

export default validateAddress