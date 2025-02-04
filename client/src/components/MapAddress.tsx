// frontend/MapAddress.tsx
import { useEffect, useState } from 'react';
import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
  Marker,
} from '@vis.gl/react-google-maps';

type Props = {
  numberAndStreet: string;
  city: string;
  state: string;
  zipCode: string;
};

export function MapAddress({ numberAndStreet, city, state, zipCode }: Props) {
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Use the appropriate environment variable for your front end.
  const apiKey = 'AIzaSyBDnDYwFE87WwpDY6wiyvmMX7w31qmjo_A';
  if (!apiKey) {
    throw new Error('Missing Google Maps API key.');
  }

  useEffect(() => {
    async function fetchCoordinates() {
      try {
        const queryParams = new URLSearchParams({
          numberAndStreet,
          city,
          state,
          zipCode,
        });
        const response = await fetch(`/api/geocode?${queryParams.toString()}`);
        if (!response.ok) {
          console.error('Error fetching coordinates from backend.');
          return;
        }
        const data = await response.json();
        setCoordinates(data);
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    }

    fetchCoordinates();
  }, [numberAndStreet, city, state, zipCode]);

  return (
    <APIProvider
      apiKey={'AIzaSyBDnDYwFE87WwpDY6wiyvmMX7w31qmjo_A'}
      onLoad={() => console.log('Maps API has loaded.')}>
      {coordinates ? (
        <Map
          defaultZoom={13}
          defaultCenter={coordinates}
          onCameraChanged={(ev: MapCameraChangedEvent) =>
            console.log(
              'Camera changed:',
              ev.detail.center,
              'zoom:',
              ev.detail.zoom
            )
          }>
          <Marker position={coordinates} />
        </Map>
      ) : (
        <p>Loading Map ...</p>
      )}
    </APIProvider>
  );
}
