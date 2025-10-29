import React, { useState } from 'react';
import { getMockActivities, getCompletedActivities } from '../data/mockData';
import ActivityCard from './ActivityCard';
import AddPlace from './AddPlace';

function BucketList() {
  const [activeTab, setActiveTab] = useState('todo');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddPlace, setShowAddPlace] = useState(false);
  
  const allActivities = getMockActivities();
  const completedActivities = getCompletedActivities();
  
  const filteredActivities = allActivities.filter(activity => 
    activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCompletedActivities = completedActivities.filter(activity => 
    activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show AddPlace screen if showAddPlace is true
  if (showAddPlace) {
    return <AddPlace onBack={() => setShowAddPlace(false)} />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="w-full bg-white border-b border-black">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            className="w-6 h-6 flex items-center justify-center cursor-pointer"
            aria-label="Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Sydneian</h1>
          <div className="w-6"></div>
        </div>
        
        {/* Search Bar */}
        <div className="px-4 pb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-black rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pb-4">
        <div className="flex rounded-md overflow-hidden">
          <button
            onClick={() => setActiveTab('todo')}
            className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-l-md ${
              activeTab === 'todo'
                ? 'bg-black text-white'
                : 'bg-white text-black border border-black'
            }`}
          >
            To Do
          </button>
          <button
            onClick={() => setActiveTab('done')}
            className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-r-md border-l border-black ${
              activeTab === 'done'
                ? 'bg-black text-white'
                : 'bg-white text-black border border-black'
            }`}
          >
            Done
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="space-y-4 py-2">
          {activeTab === 'todo' ? (
            filteredActivities.length > 0 ? (
              filteredActivities.map(activity => (
                <ActivityCard key={activity.id} activity={activity} isCompleted={false} />
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No activities found
              </div>
            )
          ) : (
            filteredCompletedActivities.length > 0 ? (
              filteredCompletedActivities.map(activity => (
                <ActivityCard key={activity.id} activity={activity} isCompleted={true} />
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No completed activities found
              </div>
            )
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setShowAddPlace(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-10"
        aria-label="Add new item"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Bottom Navigation */}
      <div className="w-full bg-white border-t border-black fixed bottom-0 left-0 right-0">
        <div className="flex justify-around items-center py-2">
          <button className="flex flex-col items-center space-y-1">
            <div className="w-5 h-5 bg-black rounded-sm"></div>
            <span className="text-xs font-medium">List</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <div className="w-5 h-5 border-2 border-black rounded-sm"></div>
            <span className="text-xs font-medium">Decide</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <div className="w-5 h-5 border-2 border-black rounded-sm"></div>
            <span className="text-xs font-medium">Memories</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BucketList;

