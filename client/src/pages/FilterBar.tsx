import { useState } from 'react';

type FilterBarProps = {
  onFilter: (filters: Record<string, string>) => void;
};

export function FilterBar({ onFilter }: FilterBarProps) {
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    city: '',
    status: '',
  });

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  function handleFilterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Pass the current filters back to the parent component
    onFilter(filters);
  }

  return (
    <div>
      <form onSubmit={handleFilterSubmit} className="flex flex-wrap gap-4">
        <select
          name="status"
          onChange={handleInputChange}
          className="bg-gray-800 text-white px-4 py-2 rounded">
          <option value="">Select</option>
          <option value="for-sale">For Sale</option>
          <option value="for-rent">For Rent</option>
        </select>

        <input
          type="number"
          name="bathrooms"
          placeholder="Bathrooms"
          onChange={handleInputChange}
          className="bg-gray-800 text-white px-4 py-2 rounded placeholder-gray-400"
        />

        <input
          type="number"
          name="bedrooms"
          placeholder="Bedrooms"
          onChange={handleInputChange}
          className="bg-gray-800 text-white px-4 py-2 rounded placeholder-gray-400"
        />

        <input
          type="text"
          name="city"
          placeholder="City Name"
          onChange={handleInputChange}
          className="bg-gray-800 text-white px-4 py-2 rounded placeholder-gray-400"
        />

        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          onChange={handleInputChange}
          className="bg-gray-800 text-white px-4 py-2 rounded placeholder-gray-400"
        />

        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          onChange={handleInputChange}
          className="bg-gray-800 text-white px-4 py-2 rounded placeholder-gray-400"
        />

        <button
          type="submit"
          className="bg-gold hover:bg-yellow-600 px-4 py-2 rounded text-white bg-gray-800 ">
          Apply Filters
        </button>
      </form>
    </div>
  );
}
