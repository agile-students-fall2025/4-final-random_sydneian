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
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          {isCompleted && (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
          <h3 className={`text-lg font-bold ${isCompleted ? 'line-through text-gray-500' : ''}`}>
            {activity.title}
          </h3>
        </div>
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">{activity.likes}</span>
        </div>
      </div>
      
      <p className="text-sm mb-2">
        {activity.type} - {activity.location}
      </p>
      
      <p className="text-sm text-gray-600 mb-3">
        Added {getDaysAgoText(activity.daysAgo)} by {activity.addedBy}
      </p>
      
      <div className="flex flex-wrap gap-2">
        {activity.tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs border border-black rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ActivityCard;

