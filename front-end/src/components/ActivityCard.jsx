import React from 'react';
import './ActivityCard.css';

function ActivityCard({ activity, isCompleted = false }) {
  const getDaysAgoText = (days) => {
    if (days === 1) return '1 day ago';
    if (days === 7) return '1 week ago';
    if (days === 14) return '2 weeks ago';
    if (days === 21) return '3 weeks ago';
    return `${days} days ago`;
  };

  return (
    <div className="activity-card">
      {/* Title and Likes Row */}
      <div className="card-header">
        <h3 className={`card-title ${isCompleted ? 'completed' : ''}`}>
          {activity.title}
        </h3>
        <div className="likes-container">
          <svg className="heart-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          <span className="likes-count">{activity.likes}</span>
        </div>
      </div>
      
      {/* Type and Location */}
      <p className="card-type-location">
        {activity.type} - {activity.location}
      </p>
      
      {/* Added By Info */}
      <p className="card-added-info">
        Added {getDaysAgoText(activity.daysAgo)} by {activity.addedBy}
      </p>
      
      {/* Tags */}
      <div className="card-tags">
        {activity.tags.map((tag, index) => (
          <span key={index} className="tag">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ActivityCard;

