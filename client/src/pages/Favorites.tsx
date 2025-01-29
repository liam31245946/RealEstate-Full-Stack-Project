import { useEffect, useState } from 'react';
import { readFavorites } from '../lib';
import { Property } from '../lib';

export function Favorites() {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    async function loadFavorites() {
      try {
        const favoritedProperties = await readFavorites();
        setFavorites(favoritedProperties);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFavorites();
  }, []);

  if (isLoading) return <div>Loading favorites...</div>;
  if (error) return <div>Error loading favorites.</div>;

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Favorite Properties</h2>
      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        favorites.map((property) => (
          <div key={property.propertyId}>{property.description}</div>
        ))
      )}
    </div>
  );
}
