import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { Map } from '../components/Map';
import { readPropertyAllUser, removeProperty } from '../lib';
import { Property } from '../lib';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/useUser';

export function PropertyDetails() {
  const { propertyId } = useParams();
  const [property, setProperty] = useState<Property>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const navigate = useNavigate();
  const { user } = useUser();

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

  function handleDelete() {
    if (!property?.propertyId) throw new Error('handle delete error');
    removeProperty(property.propertyId);
    navigate('/');
  }

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
      {user?.userId === property.agentId && (
        <button
          className="bg-gray-800 text-gray-300 px-5 py-2 rounded-lg shadow-md hover:bg-gray-700 transition"
          onClick={handleDelete}>
          Delete Property
        </button>
      )}
    </div>
  );
}
