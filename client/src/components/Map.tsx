import { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

type MapProps = {
  propertyId: number;
};

const containerStyle = {
  width: '100%',
  height: '400px',
};

export function Map({ propertyId }: MapProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [error, setError] = useState<unknown>();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!, // Your API key from the .env file
  });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(`/api/properties/${propertyId}`);
        if (!response.ok) throw new Error('Failed to fetch property details');

        const property = await response.json();
        const { numberAndStreet, city, state, zipCode } = property;
        const fullAddress = `${numberAndStreet}, ${city}, ${state} ${zipCode}`;

        const geocodeResponse = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            fullAddress
          )}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
        );

        if (!geocodeResponse.ok) throw new Error('Failed to geocode address');
        const geocodeData = await geocodeResponse.json();

        if (geocodeData.results.length > 0) {
          const { lat, lng } = geocodeData.results[0].geometry.location;
          setLocation({ lat, lng });
        } else {
          setError('No geocoding results found for the address.');
        }
      } catch (error) {
        setError(error);
      }
    };

    fetchLocation();
  }, [propertyId]);

  if (!isLoaded) return <div>Loading Map...</div>;
  if (error) return <div>Error</div>;
  if (!location) return <div>Loading Location...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={15}>
      <Marker position={location} />
    </GoogleMap>
  );
}
