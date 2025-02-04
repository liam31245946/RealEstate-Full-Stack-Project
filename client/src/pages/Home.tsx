import { useState, useEffect } from 'react';
import { useUser } from '../components/useUser';
import { Property, readPropertiesAllUser } from '../lib';
import { Link } from 'react-router-dom';
import { Select } from './Select';
import { MinPrice } from './MinPrice';
import { MaxPrice } from './MaxPrice';
import { Bedrooms } from './Bedrooms';
import { Bathrooms } from './Bathrooms';
import { City } from './City';

export function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const { user } = useUser();

  // Filter State
  const [filters, setFilters] = useState({
    status: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    city: '',
  });

  // Handle Input Change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

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
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Background Image Section */}
      <div>
        <img
          src="https://dropinblog.net/34246798/files/featured/Mountain_House_-_Between_Dream__amp__Reality.png"
          alt="Luxury Home"
          className="w-full h-screen object-cover"
        />
      </div>

      {/* Filter Section */}
      <div className="bg-gray-900 p-6 shadow-lg text-white flex flex-wrap justify-center gap-4">
        <button className="bg-gold hover:bg-yellow-600 px-4 py-2 rounded text-black">
          All
        </button>

        <Select value={filters.status} onChange={handleInputChange} />

        <MinPrice value={filters.minPrice} onChange={handleInputChange} />

        <MaxPrice value={filters.maxPrice} onChange={handleInputChange} />

        <Bedrooms value={filters.bedrooms} onChange={handleInputChange} />

        <Bathrooms value={filters.bathrooms} onChange={handleInputChange} />

        <City value={filters.city} onChange={handleInputChange} />

        <button className="bg-gold hover:bg-yellow-600 px-4 py-2 rounded text-black">
          Apply Filters
        </button>
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
