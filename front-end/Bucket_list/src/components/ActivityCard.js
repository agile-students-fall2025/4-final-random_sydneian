import React from 'react';

function ActivityCard({ activity, isCompleted = false }) {
  const getDaysAgoText = (days) => {
    if (days === 1) return '1 day ago';
    if (days === 7) return '1 week ago';
    if (days === 14) return '2 weeks ago';
    if (days === 21) return '3 weeks ago';
    return `${days} days ago`;
  };

  return (
    <div className="bg-white border border-black rounded-lg p-4">
      {/* Title and Likes Row */}
      <div className="flex justify-between items-start mb-2">
        <h3 className={`text-lg font-bold flex-1 ${isCompleted ? 'line-through text-gray-500' : ''}`}>
          {activity.title}
        </h3>
        <div className="flex items-center space-x-1 ml-2">
          <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">{activity.likes}</span>
        </div>
      </div>
      
      {/* Type and Location */}
      <p className="text-sm text-black mb-1.5">
        {activity.type} - {activity.location}
      </p>
      
      {/* Added By Info */}
      <p className="text-sm text-gray-600 mb-3">
        Added {getDaysAgoText(activity.daysAgo)} by {activity.addedBy}
      </p>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {activity.tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 text-xs font-medium border border-black rounded-full bg-white"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ActivityCard;

