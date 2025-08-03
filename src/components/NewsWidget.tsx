import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

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
  const itemsToShow = showMore ? newsItems : newsItems.slice(0, 3);

  return (
    <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 overflow-hidden">
      <div className="p-4 flex justify-between items-center">
        <h2 className="font-bold text-secondary-900 dark:text-secondary-200">DevConnect News</h2>
        <Info size={16} className="text-secondary-500 dark:text-secondary-400" />
      </div>

      <ul>
        {itemsToShow.map((item, index) => (
          <li key={index} className="px-4 py-3 hover:bg-secondary-100 dark:hover:bg-secondary-700/50 transition-colors">
            <a href="#" className="group">
              <h3 className="font-semibold text-secondary-800 dark:text-secondary-300 text-sm group-hover:text-primary-700 dark:group-hover:text-primary-400">{item.headline}</h3>
              <div className="flex items-center space-x-2 text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                <span>{item.ago}</span>
                <span>•</span>
                <span>{item.readers}</span>
              </div>
            </a>
          </li>
        ))}
      </ul>

      <div className="p-4 border-t border-secondary-100 dark:border-secondary-700">
        <button 
          onClick={() => setShowMore(!showMore)} 
          className="text-sm font-semibold text-secondary-600 dark:text-secondary-400 hover:text-primary-700 dark:hover:text-primary-400 flex items-center space-x-1"
        >
          <span>{showMore ? 'Show less' : 'Show more'}</span>
          {showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
    </div>
  );
};

export default NewsWidget;