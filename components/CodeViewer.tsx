
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Repository, RepoContent } from '../types';
import githubService from '../services/githubService';
import { explainCode } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { SparklesIcon } from './icons/SparklesIcon';

interface CodeViewerProps {
  repo: Repository;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ repo }) => {
  const [contents, setContents] = useState<RepoContent[]>([]);
  const [selectedFile, setSelectedFile] = useState<{ path: string; content: string } | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isExplaining, setIsExplaining] = useState(false);
  
  const location = useLocation();
  const basePath = `/repo/${repo.id}/code`;
  const currentPath = location.pathname.startsWith(basePath) ? location.pathname.substring(basePath.length).replace(/^\//, '') : '';

  const fetchContents = useCallback(async (path: string) => {
    setIsLoading(true);
    setSelectedFile(null);
    setExplanation('');
    const data = await githubService.getRepoContents(repo.id, path);
    setContents(data);
    setIsLoading(false);
  }, [repo.id]);

  useEffect(() => {
    fetchContents(currentPath);
  }, [currentPath, fetchContents]);

  const handleFileClick = async (file: RepoContent) => {
    setIsLoading(true);
    setExplanation('');
    const content = await githubService.getFileContent(repo.id, file.path);
    setSelectedFile({ path: file.path, content });
    setIsLoading(false);
  };
  
  const handleExplainCode = async () => {
      if (!selectedFile) return;
      setIsExplaining(true);
      const result = await explainCode(selectedFile.content);
      setExplanation(result);
      setIsExplaining(false);
  }

  const renderBreadcrumbs = () => {
    const pathParts = currentPath.split('/').filter(Boolean);
    return (
      <nav className="text-sm text-gray-400 mb-4 flex items-center flex-wrap">
        <Link to={basePath} className="hover:text-blue-400">
          {repo.name}
        </Link>
        {pathParts.map((part, index) => {
          const path = pathParts.slice(0, index + 1).join('/');
          return (
            <React.Fragment key={path}>
              <span className="mx-2">/</span>
              <Link to={`${basePath}/${path}`} className="hover:text-blue-400">
                {part}
              </Link>
            </React.Fragment>
          );
        })}
      </nav>
    );
  };

  if (selectedFile) {
    return (
      <div>
        <button onClick={() => setSelectedFile(null)} className="text-blue-400 mb-4 text-sm">&larr; Back to files</button>
        <div className="bg-gray-900 border border-gray-700 rounded-lg">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="font-mono text-gray-200">{selectedFile.path}</h3>
            <button onClick={handleExplainCode} disabled={isExplaining} className="flex items-center gap-2 px-3 py-1.5 text-xs bg-purple-600 text-white rounded-md hover:bg-purple-500 disabled:bg-gray-600">
              {isExplaining ? <LoadingSpinner size="sm" /> : <SparklesIcon className="w-4 h-4" />}
              Explain Code
            </button>
          </div>
          {isExplaining && !explanation && (
             <div className="p-4 text-center text-gray-400">Generating explanation...</div>
          )}
          {explanation && (
              <div className="p-4 border-b border-gray-700 bg-gray-800">
                <h4 className="font-semibold text-gray-200 mb-2">AI Explanation</h4>
                <div className="prose prose-sm prose-invert text-gray-300" dangerouslySetInnerHTML={{ __html: explanation.replace(/```(\w+)?\n([\s\S]+?)```/g, (_match, _lang, code) => `<pre><code>${code}</code></pre>`).replace(/\n/g, '<br />') }} />
              </div>
          )}
          <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
            <code>{selectedFile.content}</code>
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div>
      {renderBreadcrumbs()}
      {isLoading ? (
        <div className="flex justify-center pt-10"><LoadingSpinner /></div>
      ) : (
        <div className="bg-gray-900 border border-gray-700 rounded-lg">
          <ul>
            {contents.map((item, index) => (
              <li key={item.sha} className={`${index < contents.length - 1 ? 'border-b border-gray-800' : ''}`}>
                {item.type === 'dir' ? (
                  <Link to={`${basePath}/${item.path}`} className="flex items-center p-3 hover:bg-gray-800">
                    <span className="mr-3">📁</span>
                    <span className="text-gray-200">{item.name}</span>
                  </Link>
                ) : (
                  <button onClick={() => handleFileClick(item)} className="flex items-center w-full text-left p-3 hover:bg-gray-800">
                    <span className="mr-3">📄</span>
                    <span className="text-gray-200">{item.name}</span>
                  </button>
                )}
              </li>
            ))}
             {contents.length === 0 && <li className="p-4 text-center text-gray-500">This directory is empty.</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CodeViewer;
