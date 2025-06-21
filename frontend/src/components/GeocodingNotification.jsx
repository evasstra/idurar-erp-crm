import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { message } from 'antd';

function GeocodingNotification() {
  const clientState = useSelector((state) => state.crud.client);
  
  useEffect(() => {
    console.log('GeocodingNotification - clientState:', clientState);
    
    if (clientState?.result?.geocoding) {
      const { status, msg } = clientState.result.geocoding;
      console.log('Geocoding result:', status, msg);
      
      const text = msg || 
        (status === 'success' 
          ? 'Coordinates were successfully determined from the address.' 
          : status === 'partial' 
            ? 'Coordinates might not be accurate. Please verify.' 
            : 'Could not determine coordinates from address. Please enter coordinates manually.');
      
      if (status === 'success') {
        message.success(text, 4.5);
      } else if (status === 'partial') {
        message.warning(text, 6);
      } else if (status === 'failed' || status === 'error') {
        message.error(text, 8);
      }
    }
  }, [clientState]);

  return null;
}

export default GeocodingNotification;
