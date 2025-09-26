import React, { useState } from 'react';
import type { Issue } from '../types';

const IssueList: React.FC<{ issues: Issue[] }> = ({ issues }) => {
    const [expandedIssue, setExpandedIssue] = useState<number | null>(null);

    const toggleExpand = (issueId: number) => {
        setExpandedIssue(expandedIssue === issueId ? null : issueId);
    };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg">
      <ul>
        {issues.map((issue, index) => (
          <li key={issue.id} className={`${index < issues.length - 1 ? 'border-b border-gray-800' : ''}`}>
            <div onClick={() => toggleExpand(issue.id)} className="p-4 cursor-pointer hover:bg-gray-800 transition-colors">
                <div className="flex items-start justify-between">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${issue.state === 'open' ? 'bg-green-500 text-white' : 'bg-purple-400 text-white'}`}>
                        {issue.state}
                    </span>
                    <div className="flex-1 ml-3">
                        <p className="font-semibold text-gray-200">{issue.title}</p>
                        <p className="text-sm text-gray-400 mt-1">
                            #{issue.id} opened by {issue.author.name} on {new Date(issue.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
            {expandedIssue === issue.id && (
                <div className="p-4 border-t border-gray-800 bg-gray-950">
                    <p className="whitespace-pre-wrap text-gray-300">{issue.body}</p>
                    {issue.comments.length > 0 && (
                        <div className="mt-4 border-t border-gray-700 pt-4">
                            <h4 className="font-semibold mb-2">Comments</h4>
                            {issue.comments.map((comment, i) => (
                                <div key={i} className="text-sm text-gray-400 mt-2">
                                    <strong>{comment.author.name}:</strong> {comment.body}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IssueList;