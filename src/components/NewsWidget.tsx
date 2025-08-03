// src/components/NewsWidget.tsx
import React, { useState } from 'react';
import { Info, ChevronDown } from 'lucide-react';

// Mock data to simulate news stories
const newsItems = [
  {
    headline: 'The top skills companies are hiring for now',
    ago: '1d ago',
    readers: '351,915 readers',
  },
  {
    headline: 'Tech salaries see a significant rise in Delhi',
    ago: '2d ago',
    readers: '15,887 readers',
  },
  {
    headline: 'How to stand out in a remote interview',
    ago: '2d ago',
    readers: '61,521 readers',
  },
  {
    headline: 'The future of AI in software development',
    ago: '3d ago',
    readers: '40,501 readers',
  },
  {
    headline: 'New JavaScript framework gains popularity',
    ago: '4d ago',
    readers: '22,109 readers',
  },
];

const NewsWidget: React.FC = () => {
  const [showMore, setShowMore] = useState(false);
  const itemsToShow = showMore ? newsItems : newsItems.slice(0, 4);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
      <div className="p-4 flex justify-between items-center">
        <h2 className="font-bold text-secondary-900">DevConnect News</h2>
        <Info size={16} className="text-secondary-500" />
      </div>

      <ul>
        {itemsToShow.map((item, index) => (
          <li key={index} className="px-4 py-2 hover:bg-secondary-100">
            <a href="#" className="group">
              <h3 className="font-semibold text-secondary-800 text-sm group-hover:text-primary-700">{item.headline}</h3>
              <div className="flex items-center space-x-2 text-xs text-secondary-500 mt-1">
                <span>{item.ago}</span>
                <span>•</span>
                <span>{item.readers}</span>
              </div>
            </a>
          </li>
        ))}
      </ul>

      {!showMore && (
        <div className="p-4">
          <button 
            onClick={() => setShowMore(true)} 
            className="text-sm font-semibold text-secondary-600 hover:text-primary-700 flex items-center space-x-1"
          >
            <span>Show more</span>
            <ChevronDown size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsWidget;