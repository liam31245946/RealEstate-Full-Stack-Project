import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { readPropertyAllUser, removeProperty } from '../lib';
import { Property } from '../lib';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/useUser';
import { MapAddress } from '../components/MapAddress';

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

  if (isLoading)
    return <div className="text-center text-gold text-xl">Loading...</div>;

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

  function handleUpdate() {
    navigate(`/update/${propertyId}`);
  }

  return (
    <div className="bg-black text-white min-h-screen w-full flex flex-col">
      {/* Property Image */}
      <div className="w-full flex justify-center">
        <img
          src={property.imageUrl}
          alt="property picture"
          className="rounded-lg shadow-lg w-full max-w-4xl"
        />
      </div>

      {/* Property Details */}
      <div className="mt-8">
        <h3 className="text-3xl text-gold font-bold">What's Special</h3>
        <p className="text-gray-300 mt-3">{property.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6 ">
        <div>
          <p className="text-3xl text-gold font-semibold">
            ${property.price.toLocaleString()}
          </p>
          <div className="flex gap-5 text-gray-300 mt-3">
            <p>🛏 {property.bedrooms} Bedrooms</p>
            <p>🛁 {property.bathrooms} Bathrooms</p>
            <p>📏 {property.size} sqft</p>
          </div>

          <div className="mt-6">
            <h3 className="text-2xl text-gold font-bold">Features</h3>
            <p className="text-gray-300 mt-2">{property.features}</p>
          </div>

          <p className="text-lg text-gold-500 mt-6">
            {property.numberAndStreet}, {property.city}, {property.state}{' '}
            {property.zipCode}
          </p>
          <MapAddress
            numberAndStreet={property.numberAndStreet}
            city={property.city}
            state={property.state}
            zipCode={property.zipCode}
          />
          {/* Agent Actions */}
          {user?.userId === property.agentId && (
            <div className="mt-8 flex gap-4">
              <button
                className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-white font-semibold shadow-md transition"
                onClick={handleDelete}>
                Delete Property
              </button>

              <form onSubmit={handleUpdate}>
                <button
                  className="bg-gray-800 text-gray-300 px-5 py-2 rounded-lg shadow-md hover:bg-gray-700 transition"
                  type="submit">
                  Update
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
