import React, { useState } from 'react';
import { getPreviewData } from '../data/mockData';

function AddPlaceThroughLink({ onBack }) {
  const [link, setLink] = useState('');
  const [tags, setTags] = useState('');
  const previewData = getPreviewData();

  const suggestedLink = 'https://tiktok.com/@rickastleyofficial/video/1234567890';

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (!link) {
        setLink(suggestedLink);
      }
    }
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
          <h1 className="text-xl font-bold">Import From Link</h1>
          <div className="w-6"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* Paste Link Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">Paste TikTok or Instagram Link.</h2>
          <input
            type="text"
            placeholder="https://tiktok.com/@rickastleyofficial/vide..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 border border-black rounded-md text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-black"
          />
          <button className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Import Details
          </button>
        </div>

        {/* Preview Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">Preview.</h2>
          <div className="w-full h-48 bg-gray-200 border border-black rounded-lg flex items-center justify-center mb-3">
            <span className="text-gray-600 font-medium">Photo</span>
          </div>
          <h3 className="text-lg font-bold">{previewData.name}</h3>
          <p className="text-sm">{previewData.location}</p>
        </div>

        {/* Highlights Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">Highlights.</h2>
          <ul className="space-y-1">
            {previewData.highlights.map((highlight, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span className="text-sm">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Add Tags Section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">Add Tags (Optional).</h2>
          <input
            type="text"
            placeholder="#aesthetic, #matcha, #brunch"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 border border-black rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Action Button */}
        <button className="w-full bg-black text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors">
          Add to Bucket List
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

export default AddPlaceThroughLink;

