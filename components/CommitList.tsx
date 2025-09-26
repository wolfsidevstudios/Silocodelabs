
import React from 'react';
import type { Commit } from '../types';

const CommitList: React.FC<{ commits: Commit[] }> = ({ commits }) => {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg">
      <ul>
        {commits.map((commit, index) => (
          <li key={commit.sha} className={`p-4 ${index < commits.length - 1 ? 'border-b border-gray-800' : ''}`}>
            <p className="font-semibold text-gray-200">{commit.message}</p>
            <div className="flex items-center text-sm text-gray-400 mt-2">
              <img src={commit.author.avatarUrl} alt={commit.author.name} className="w-5 h-5 rounded-full mr-2" />
              <span className="font-medium mr-2">{commit.author.name}</span>
              <span>committed on {new Date(commit.date).toLocaleDateString()}</span>
            </div>
            <p className="font-mono text-xs text-gray-500 mt-2">SHA: {commit.sha}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommitList;
