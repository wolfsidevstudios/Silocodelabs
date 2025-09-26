import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Repository, FileContent } from '../types';
import { githubService } from '../services/githubService';
import LoadingSpinner from './LoadingSpinner';

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
    </div>
  );
};

export default CodeViewer;