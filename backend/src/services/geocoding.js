const fetch = require('node-fetch');

const geocodeAddress = async (address) => {
  if (!address) return { 
    latitude: null, 
    longitude: null,
    status: 'failed',
    message: 'No address provided'
  };
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
      {
        headers: {
          'User-Agent': 'Idurar-ERP-CRM/1.0 (hello@idurarapp.com)'
        }
      }
    );
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
        status: 'success',
        message: 'Coordinates successfully determined'
      };
    } else {
      return {
        latitude: null,
        longitude: null,
        status: 'failed',
        message: 'No results found for this address'
      };
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    return {
      latitude: null,
      longitude: null,
      status: 'error',
      message: 'Geocoding service unavailable'
    };
  }
};

module.exports = { geocodeAddress };
