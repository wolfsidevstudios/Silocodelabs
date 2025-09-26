
import React, { useState } from 'react';
import type { Issue } from '../types';
import { summarizeText } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { SparklesIcon } from './icons/SparklesIcon';

const IssueList: React.FC<{ issues: Issue[] }> = ({ issues }) => {
    const [expandedIssue, setExpandedIssue] = useState<number | null>(null);
    const [aiSummary, setAiSummary] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    const toggleExpand = (issueId: number) => {
        setExpandedIssue(expandedIssue === issueId ? null : issueId);
        setAiSummary(null); // Reset summary when toggling
    };
    
    const handleAiSummary = async (issue: Issue) => {
        setIsAiLoading(true);
        setAiSummary(null);
        const fullText = `Title: ${issue.title}\n\nBody: ${issue.body}\n\nComments:\n${issue.comments.map(c => `- ${c.author.name}: ${c.body}`).join('\n')}`;
        const summary = await summarizeText(fullText);
        setAiSummary(summary);
        setIsAiLoading(false);
    }

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
                    <div className="mt-4 pt-4 border-t border-gray-700">
                        <button onClick={() => handleAiSummary(issue)} className="flex items-center gap-2 px-3 py-1 bg-purple-500 text-white rounded-md text-xs hover:bg-purple-600 transition-colors disabled:opacity-50" disabled={isAiLoading}>
                            <SparklesIcon className="w-4 h-4" /> AI Summary
                        </button>
                        {isAiLoading && <div className="mt-2"><LoadingSpinner/></div>}
                        {aiSummary && (
                             <div className="mt-4 p-3 bg-gray-800 rounded-md text-sm text-gray-300 prose prose-sm prose-invert" dangerouslySetInnerHTML={{ __html: aiSummary.replace(/\n/g, '<br/>') }} />
                        )}
                    </div>
                </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IssueList;
