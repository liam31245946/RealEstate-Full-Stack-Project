import { useState, useEffect } from 'react';
import { useUser } from '../components/useUser';
import {
  Property,
  readPropertiesAllUser,
  readPropertiesFiltered,
} from '../lib';
import { Link } from 'react-router-dom';
import { FilterBar } from './FilterBar';

export function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const { user } = useUser();

  useEffect(() => {
    async function load() {
      try {
        const fetchedProperties = await readPropertiesAllUser();
        setProperties(fetchedProperties);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    setIsLoading(true);
    load();
  }, []);

  if (isLoading) return <div className="text-center text-gold">Loading...</div>;
  if (error) {
    return (
      <div className="text-center text-red-500">
        Error Loading Properties:{' '}
        {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );
  }

  function handleFilter(filters: Record<string, string>) {
    // Use the filters to fetch properties and update state
    readPropertiesFiltered(filters)
      .then(setProperties)
      .catch((err) => {
        alert('Filter failed: ' + err);
      });
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Background Image Section */}
      <div>
        <img
          src="https://dropinblog.net/34246798/files/featured/Mountain_House_-_Between_Dream__amp__Reality.png"
          alt="Luxury Home"
          className="w-full h-screen"
        />
      </div>

      {/* Filter Section */}
      <div className="bg-gray-900 p-6 shadow-lg text-white flex flex-wrap justify-center gap-4">
        <FilterBar onFilter={handleFilter} />
      </div>

      {/* Property Listings Section */}
      <div className="container mx-auto px-4 py-10">
        <h2 className="text-gold text-3xl font-bold mb-6">
          Available Properties
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.propertyId} property={property} />
          ))}
        </div>
      </div>

      {/* User Info Section */}
      <div className="text-center">
        {user ? (
          <p className="text-lg text-gold">
            Welcome back, {user.username}! You are signed in.
          </p>
        ) : (
          <p className="text-lg text-gold">Welcome To Dream Home!</p>
        )}
      </div>
    </div>
  );
}

// PropertyCard Component
type CardProps = {
  property: Property;
};

function PropertyCard({ property }: CardProps) {
  const { propertyId, price, imageUrl, bedrooms, bathrooms, size } = property;
  return (
    <Link
      to={`property/${propertyId}`}
      className="block cursor-pointer bg-gray-900 text-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all">
      <img
        src={imageUrl}
        className="w-full h-64 object-cover"
        alt={`Property ${propertyId}`}
      />

      <div className="p-4">
        <h3 className="text-gold text-lg font-semibold">
          $ {price.toLocaleString()}
        </h3>
        <div className="mt-2 flex flex-wrap gap-2 text-gray-300 text-sm">
          <span>🛏 {bedrooms} Bedrooms</span>
          <span>🛁 {bathrooms} Baths</span>
          <span>📏 {size} sq ft</span>
        </div>
      </div>
    </Link>
  );
}
