
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Repository, FileContent } from '../types';
import { githubService } from '../services/githubService';
import { explainCode } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { SparklesIcon } from './icons/SparklesIcon';

const SimpleSyntaxHighlighter: React.FC<{ code: string }> = ({ code }) => {
    const highlight = (text: string) => {
        return text
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/(const|let|var|function|import|export|from|return|if|else|async|await|new|default)/g, '<span class="text-purple-400">$1</span>')
            .replace(/(\'|\"|\`)(.*?)(\'|\"|\`)/g, '<span class="text-green-400">$1$2$3</span>')
            .replace(/(\/\/.*)/g, '<span class="text-gray-500">$1</span>')
            .replace(/(\{|\}|\(|\)|\[|\])/g, '<span class="text-yellow-500">$1</span>');
    };

    return (
        <pre className="text-sm overflow-x-auto"><code dangerouslySetInnerHTML={{ __html: highlight(code) }} /></pre>
    );
};

const CodeViewer: React.FC<{ repo: Repository }> = ({ repo }) => {
  const params = useParams();
  const navigate = useNavigate();
  const path = params['*'] || '';
  const [content, setContent] = useState<FileContent[] | FileContent | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      if (path.endsWith('/')) {
        navigate(`/repo/${repo.id}/code/${path.slice(0, -1)}`, { replace: true });
        return;
      }
      const isFile = repo.files.some(f => f.path === path && f.type === 'file');
      
      let data;
      if (isFile) {
        data = await githubService.getFileContent(repo.id, path);
      } else {
        const dirPath = path ? path : '/';
        data = await githubService.getFiles(repo.id, path || '/');
      }
      setContent(data || null);
      setLoading(false);
    };
    loadContent();
  }, [path, repo.id, repo.files, navigate]);
  
  const handleExplainCode = async (code: string) => {
    setIsModalOpen(true);
    setIsAiLoading(true);
    const explanation = await explainCode(code);
    setAiExplanation(explanation);
    setIsAiLoading(false);
  };
  
  const breadcrumbs = ['code', ...path.split('/').filter(p => p)];

  if (loading) {
    return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
  }
  
  const renderContent = () => {
    if (!content) return <p>Content not found.</p>;

    if (Array.isArray(content)) { // Directory view
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg">
          {content.map(item => (
            <Link key={item.name} to={`/repo/${repo.id}/code/${item.path}`} className="flex items-center p-3 border-b border-gray-800 last:border-b-0 hover:bg-gray-800 transition-colors">
              <span className="mr-2">{item.type === 'dir' ? '📁' : '📄'}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      );
    } else { // File view
        const fileContent = content.content || '';
        return (
            <div className="bg-gray-900 border border-gray-700 rounded-lg">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="font-mono">{content.name}</h3>
                    <button onClick={() => handleExplainCode(fileContent)} className="flex items-center gap-2 px-3 py-1 bg-purple-500 text-white rounded-md text-xs hover:bg-purple-600 transition-colors disabled:opacity-50" disabled={isAiLoading}>
                       <SparklesIcon className="w-4 h-4" /> Explain with AI
                    </button>
                </div>
                <div className="p-4">
                  <SimpleSyntaxHighlighter code={fileContent} />
                </div>
            </div>
        )
    }
  };

  return (
    <div>
        <div className="mb-4 text-sm text-gray-400">
            {breadcrumbs.map((crumb, index) => (
            <span key={index}>
                <Link to={`/repo/${repo.id}/code/${breadcrumbs.slice(1, index + 1).join('/')}`} className="hover:underline hover:text-blue-500">
                {crumb}
                </Link>
                {index < breadcrumbs.length - 1 && ' / '}
            </span>
            ))}
        </div>
        {renderContent()}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
                    <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                        <h2 className="text-lg font-semibold flex items-center gap-2"><SparklesIcon className="w-5 h-5 text-purple-400"/> AI Code Explanation</h2>
                        <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">&times;</button>
                    </div>
                    <div className="p-6 overflow-y-auto">
                        {isAiLoading ? <LoadingSpinner/> : <div className="prose prose-sm prose-invert" dangerouslySetInnerHTML={{ __html: aiExplanation.replace(/\n/g, '<br/>') }} />}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default CodeViewer;
