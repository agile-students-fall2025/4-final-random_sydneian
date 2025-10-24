import React, { useState } from 'react';

function AddPlaceManually({ onBack }) {
  const [formData, setFormData] = useState({
    placeName: '',
    location: '',
    category: '',
    description: '',
    tags: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="w-full bg-white">
        <div className="flex items-center justify-between px-4 py-3 border-b border-black">
          <button 
            onClick={onBack}
            className="w-6 h-6 flex items-center justify-center border border-black rounded"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Add Manually</h1>
          <div className="w-6"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* Place Name */}
        <div className="mb-4">
          <input
            type="text"
            name="placeName"
            placeholder="Place name"
            value={formData.placeName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-black rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-black rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Select Category */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              name="category"
              placeholder="Select category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-black rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
            <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Description</label>
          <textarea
            name="description"
            placeholder="Some notes..."
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-black rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black resize-none"
          />
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Tags</label>
          <input
            type="text"
            name="tags"
            placeholder="#tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-black rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Add Photos */}
        <div className="mb-6">
          <div className="w-full h-32 border-2 border-dashed border-black rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-2 text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm font-medium">Add Photos</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full bg-black text-white py-4 px-6 rounded-lg font-bold hover:bg-gray-800 transition-colors">
          Add to your Bucket List!
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="w-full bg-white border-t border-black py-2 pb-safe">
        <div className="flex justify-around items-center">
          <button className="flex flex-col items-center space-y-1">
            <div className="w-5 h-5 bg-black"></div>
            <span className="text-xs font-medium">List</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <div className="w-5 h-5 border-2 border-black"></div>
            <span className="text-xs font-medium">Decide</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <div className="w-5 h-5 border-2 border-black"></div>
            <span className="text-xs font-medium">Memories</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddPlaceManually;

