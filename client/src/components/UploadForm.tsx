import { type FormEvent } from 'react';
import { useState } from 'react';
import { useUser } from './useUser';
import { readToken } from '../lib';
import { useNavigate } from 'react-router-dom';
import { type Property } from '../lib';

export function UploadForm() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [uploaded, setUploaded] = useState<Property>();
  // const [imageUrl, setImageUrl] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      console.log([...formData.entries()]);

      formData.append('agentId', String(user?.userId));

      const response = await fetch('/api/properties', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${readToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
      const result = (await response.json()) as Property;
      setUploaded(result);
      navigate('/');
    } catch (err) {
      alert('Upload failed, please try again.');
    }
  }
  // function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
  //   setImageUrl(event.target.value);
  // }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#121212] to-[#1c1c1c]">
      <div className="w-full max-w-2xl bg-[#1A1A1A] bg-opacity-90 shadow-lg backdrop-blur-md rounded-2xl p-8 border border-gray-800">
        <h3 className="text-3xl font-semibold text-white text-center mb-6">
          Upload Property
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <label className="block">
              <span className="text-gray-400">Description</span>
              <input
                required
                type="text"
                name="description"
                className="w-full bg-[#222] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-yellow-500 focus:ring-yellow-400 outline-none transition"
              />
            </label>

            <label className="block">
              <span className="text-gray-400">Price ($)</span>
              <input
                required
                type="number"
                name="price"
                className="w-full bg-[#222] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-yellow-500 focus:ring-yellow-400 outline-none transition"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-gray-400">Status</span>
            <select
              required
              name="status"
              className="w-full bg-[#222] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-yellow-500 focus:ring-yellow-400 outline-none transition">
              <option value=""></option>
              <option value="for-sale">For Sale</option>
              <option value="for-rent">For Rent</option>
            </select>
          </label>

          <div className="grid grid-cols-3 gap-4">
            <label className="block">
              <span className="text-gray-400">Size (sq ft)</span>
              <input
                required
                type="number"
                name="size"
                className="w-full bg-[#222] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-yellow-500 focus:ring-yellow-400 outline-none transition"
              />
            </label>
            <label className="block">
              <span className="text-gray-400">Bedrooms</span>
              <input
                required
                type="number"
                name="bedrooms"
                className="w-full bg-[#222] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-yellow-500 focus:ring-yellow-400 outline-none transition"
              />
            </label>
            <label className="block">
              <span className="text-gray-400">Bathrooms</span>
              <input
                required
                type="number"
                name="bathrooms"
                className="w-full bg-[#222] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-yellow-500 focus:ring-yellow-400 outline-none transition"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-gray-400">Features</span>
            <input
              required
              type="text"
              name="features"
              className="w-full bg-[#222] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-yellow-500 focus:ring-yellow-400 outline-none transition"
            />
          </label>

          <div className="grid grid-cols-3 gap-4">
            <label className="block">
              <span className="text-gray-400">City</span>
              <input
                required
                type="text"
                name="city"
                className="w-full bg-[#222] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-yellow-500 focus:ring-yellow-400 outline-none transition"
              />
            </label>
            <label className="block">
              <span className="text-gray-400">State</span>
              <input
                required
                type="text"
                name="state"
                className="w-full bg-[#222] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-yellow-500 focus:ring-yellow-400 outline-none transition"
              />
            </label>
            <label className="block">
              <span className="text-gray-400">Zip Code</span>
              <input
                required
                type="text"
                name="zipCode"
                className="w-full bg-[#222] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-yellow-500 focus:ring-yellow-400 outline-none transition"
              />
            </label>
          </div>
          <label className="block">
            <span className="text-gray-400">Number and Street</span>
            <input
              required
              type="text"
              name="numberAndStreet"
              className="w-full bg-[#222] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-yellow-500 focus:ring-yellow-400 outline-none transition"
            />
          </label>

          <label className="block">
            <span className="text-gray-400">Upload Image</span>
            <input
              type="file"
              name="image"
              accept=".png, .jpg, .jpeg, .gif, .webp"
              className="w-full bg-[#222] text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-yellow-500 focus:ring-yellow-400 outline-none transition"
            />
            {/* <div>
              <p className="text-gray-400">OR</p>
            </div>
            <div className="flex items-center bg-[#222] text-white rounded-lg border border-gray-700 px-4 py-2">
              <input
                type="text"
                placeholder="Paste image URL here ..."
                value={imageUrl}
                onChange={handleInputChange}
                accept=".png, .jpg, .jpeg, .gif,.webp"
                className="w-full bg-transparent outline-none text-white"
              />
            </div> */}
          </label>

          <button
            type="submit"
            className="w-full  bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 rounded-xl font-semibold text-lg shadow-lg transition duration-300 hover:from-gray-700 hover:to-gray-800">
            Upload Property
          </button>
        </form>
        {uploaded && (
          <div>
            <p>Description: {uploaded.description}</p>
            <p>Price: ${uploaded.price}</p>
            <img src={uploaded.imageUrl} alt="Uploaded Property" width={200} />
          </div>
        )}
      </div>
    </div>
  );
}
