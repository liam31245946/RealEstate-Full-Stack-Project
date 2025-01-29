import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { Map } from '../components/Map';
import { removeFavorite, addFavorite, readPropertyAllUser } from '../lib';
import { useUser } from '../components/useUser';
import { Property } from '../lib';

export function PropertyDetails() {
  const { propertyId } = useParams();
  const [property, setProperty] = useState<Property>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const { user } = useUser();

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function loadProperty(id: number) {
      try {
        const property = await readPropertyAllUser(id);
        if (!property) throw new Error('Property not found');
        setProperty(property);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (propertyId) {
      setIsLoading(true);
      loadProperty(Number(propertyId));
    }
  }, [propertyId]);

  async function handleFavorite() {
    if (!property || !user) return;

    try {
      if (isFavorite) {
        await removeFavorite(property.propertyId);
        setIsFavorite(false);
      } else {
        await addFavorite(property.propertyId);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Error handling favorite:', err);
    }
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return (
      <div className="text-center text-red-500">
        Error Loading Property {propertyId}:{' '}
        {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );
  }
  if (!property) return null;

  return (
    <div className="p-4">
      <img src={property.imageUrl} alt="property picture" />

      <div>
        <h3>What's Special</h3>
        <p>{property.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p>${property.price.toLocaleString()}</p>
          <div className="flex gap-5">
            <p>🛏 {property.bedrooms} Bedrooms</p>
            <p>🛁{property.bathrooms} Bathrooms</p>
            <p>{property.size} sqft</p>
          </div>

          <div>
            <h3>Features</h3>
            <p>{property.features}</p>
          </div>

          <p className="text-lg text-gray-600">
            {property.numberAndStreet}, {property.city}, {property.state}{' '}
            {property.zipCode}
          </p>
        </div>
      </div>

      {user && (
        <button
          onClick={handleFavorite}
          className={`border border-gray-300 rounded py-1 px-3 mx-10 ${
            isFavorite ? 'bg-red-500 text-white' : 'bg-gray-200'
          }`}>
          {isFavorite ? 'Unfavorite' : 'Favorite'}
        </button>
      )}
    </div>
  );
}
