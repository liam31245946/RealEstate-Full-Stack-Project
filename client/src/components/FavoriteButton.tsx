// FavoriteButton.tsx
import { useState, useEffect } from 'react';
import { BsBookmarkCheckFill, BsBookmarkX } from 'react-icons/bs';

type FavoriteButtonProps = {
  propertyId: number;
};

export function FavoriteButton({ propertyId }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if the property is already favorited
  useEffect(() => {
    async function checkFavorite() {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await fetch('/api/favorites', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          if (
            data.favorites?.some((fav: any) => fav.propertyId === propertyId)
          ) {
            setIsFavorite(true);
          }
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    }
    checkFavorite();
  }, [propertyId]);

  async function handleToggleFavorite() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to favorite properties.');
      return;
    }
    try {
      if (isFavorite) {
        // Remove favorite using DELETE endpoint
        const response = await fetch(`/api/favorites/${propertyId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          setIsFavorite(false);
        } else {
          console.error('Error removing favorite.');
        }
      } else {
        // Add favorite using POST endpoint
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ propertyId }),
        });
        if (response.ok) {
          setIsFavorite(true);
        } else {
          console.error('Error adding favorite.');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }

  return (
    <button
      onClick={handleToggleFavorite}
      className="mt-2 px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition">
      {isFavorite ? <BsBookmarkCheckFill /> : <BsBookmarkX />}
    </button>
  );
}
