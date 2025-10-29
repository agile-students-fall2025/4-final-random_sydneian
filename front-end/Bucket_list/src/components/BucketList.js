import React, { useState } from 'react';
import { getMockActivities, getCompletedActivities } from '../data/mockData';
import ActivityCard from './ActivityCard';
import AddPlace from './AddPlace';
import './BucketList.css';

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
    <div className="bucket-list-container">
      {/* Header */}
      <div className="bucket-list-header">
        <div className="bucket-list-header-content">
          <button 
            className="back-button"
            aria-label="Back"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="bucket-list-title">Sydneian</h1>
          <div className="header-spacer"></div>
        </div>
        
        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs-wrapper">
          <button
            onClick={() => setActiveTab('todo')}
            className={`tab-button ${activeTab === 'todo' ? 'todo-active' : 'todo-inactive'}`}
          >
            To Do
          </button>
          <button
            onClick={() => setActiveTab('done')}
            className={`tab-button ${activeTab === 'done' ? 'done-active' : 'done-inactive'}`}
          >
            Done
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="content-area">
        <div className="content-list">
          {activeTab === 'todo' ? (
            filteredActivities.length > 0 ? (
              filteredActivities.map(activity => (
                <ActivityCard key={activity.id} activity={activity} isCompleted={false} />
              ))
            ) : (
              <div className="empty-state">
                No activities found
              </div>
            )
          ) : (
            filteredCompletedActivities.length > 0 ? (
              filteredCompletedActivities.map(activity => (
                <ActivityCard key={activity.id} activity={activity} isCompleted={true} />
              ))
            ) : (
              <div className="empty-state">
                No completed activities found
              </div>
            )
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setShowAddPlace(true)}
        className="fab-button"
        aria-label="Add new item"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <div className="bottom-nav-content">
          <button className="nav-button">
            <div className="nav-icon"></div>
            <span className="nav-label">List</span>
          </button>
          <button className="nav-button">
            <div className="nav-icon-outlined"></div>
            <span className="nav-label">Decide</span>
          </button>
          <button className="nav-button">
            <div className="nav-icon-outlined"></div>
            <span className="nav-label">Memories</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BucketList;

