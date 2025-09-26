
import React from 'react';
import type { PullRequest } from '../types';

const PRList: React.FC<{ pullRequests: PullRequest[] }> = ({ pullRequests }) => {

    const getStateColor = (state: 'open' | 'closed' | 'merged') => {
        switch(state) {
            case 'open': return 'bg-green-500 text-white';
            case 'closed': return 'bg-red-500 text-white';
            case 'merged': return 'bg-purple-400 text-white';
            default: return 'bg-gray-500 text-white';
        }
    }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg">
      <ul>
        {pullRequests.map((pr, index) => (
          <li key={pr.id} className={`p-4 ${index < pullRequests.length - 1 ? 'border-b border-gray-800' : ''} hover:bg-gray-800 transition-colors cursor-pointer`}>
            <div className="flex items-start justify-between">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStateColor(pr.state)}`}>
                    {pr.state}
                </span>
                <div className="flex-1 ml-3">
                    <p className="font-semibold text-gray-200">{pr.title}</p>
                    <p className="text-sm text-gray-400 mt-1">
                        #{pr.id} opened by {pr.author.name} on {new Date(pr.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
          </li>
        ))}
         {pullRequests.length === 0 && <li className="p-4 text-center text-gray-500">No pull requests found.</li>}
      </ul>
    </div>
  );
};

export default PRList;
