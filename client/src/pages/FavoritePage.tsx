import { useState, useEffect } from 'react';
import { Property } from '../lib';
import { PropertyCard } from './PropertyCard';

export function FavoritesPage() {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      // the token from SignInForm.tsx
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('/api/favorites', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setFavorites(data.favorites);
        } else {
          console.error('Error fetching favorites.');
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchFavorites();
  }, []);

  if (loading)
    return <div className="text-center text-gold">Loading favorites...</div>;

  return (
    <div className="bg-black text-white min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Your Favorite Properties</h1>
      {favorites.length === 0 ? (
        <p>Your Favored List Is Empty</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((property) => (
            <PropertyCard key={property.propertyId} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
