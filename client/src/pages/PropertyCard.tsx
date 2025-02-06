import { Link } from 'react-router-dom';
import { FavoriteButton } from '../components/FavoriteButton';
import { Property } from '../lib';

export type CardProps = {
  property: Property;
};

export function PropertyCard({ property }: CardProps) {
  const { propertyId, price, imageUrl, bedrooms, bathrooms, size } = property;
  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all">
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
      <div className="absolute top-2 right-2">
        <FavoriteButton propertyId={propertyId} />
      </div>
    </div>
  );
}
