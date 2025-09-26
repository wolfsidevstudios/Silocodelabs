
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, Routes, Route, useNavigate } from 'react-router-dom';
import { githubService } from '../services/githubService';
import type { Repository } from '../types';
import Layout from './Layout';
import LoadingSpinner from './LoadingSpinner';
import CodeViewer from './CodeViewer';
import CommitList from './CommitList';
import IssueList from './IssueList';
import PRList from './PRList';
import AIAssistant from './AIAssistant';
import { CodeIcon } from './icons/CodeIcon';
import { CommitIcon } from './icons/CommitIcon';
import { IssueIcon } from './icons/IssueIcon';
import { PullRequestIcon } from './icons/PullRequestIcon';
import { SparklesIcon } from './icons/SparklesIcon';

const RepoDetail: React.FC = () => {
  const { repoId } = useParams<{ repoId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [repo, setRepo] = useState<Repository | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAiAssistantOpen, setAiAssistantOpen] = useState(false);

  useEffect(() => {
    if (!repoId) return;
    const fetchRepo = async () => {
      setLoading(true);
      const data = await githubService.getRepository(repoId);
      setRepo(data || null);
      setLoading(false);
    };
    fetchRepo();
  }, [repoId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  }

  if (!repo) {
    return <Layout title="Error"><p>Repository not found.</p></Layout>;
  }

  const getTabClass = (path: string) => {
    const isActive = location.pathname.includes(`/repo/${repoId}/${path}`);
    return `flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive ? 'bg-blue-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`;
  };
  
  const title = (
    <div className="flex items-center gap-2 text-lg font-semibold text-gray-200 truncate">
        <span className="text-gray-500">{repo.owner.name} /</span>
        <span className="text-white">{repo.name}</span>
    </div>
  );

  return (
    <div className="h-screen flex flex-col">
       <Layout title={title}>
         <div className="flex-1 flex flex-col min-h-0">
            <div className="border-b border-gray-700 px-4 mb-4">
                <nav className="flex space-x-2 overflow-x-auto pb-2 -mb-px">
                <Link to={`/repo/${repoId}/code`} className={getTabClass('code')}><CodeIcon className="w-4 h-4"/> Code</Link>
                <Link to={`/repo/${repoId}/commits`} className={getTabClass('commits')}><CommitIcon className="w-4 h-4"/> Commits</Link>
                <Link to={`/repo/${repoId}/issues`} className={getTabClass('issues')}><IssueIcon className="w-4 h-4"/> Issues</Link>
                <Link to={`/repo/${repoId}/pull-requests`} className={getTabClass('pull-requests')}><PullRequestIcon className="w-4 h-4"/> PRs</Link>
                </nav>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4">
                <Routes>
                    <Route path="code/*" element={<CodeViewer repo={repo} />} />
                    <Route path="commits" element={<CommitList commits={repo.commits} />} />
                    <Route path="issues" element={<IssueList issues={repo.issues} />} />
                    <Route path="pull-requests" element={<PRList pullRequests={repo.pullRequests} />} />
                </Routes>
            </div>
         </div>
      </Layout>
      <button 
        onClick={() => setAiAssistantOpen(true)}
        className="fixed bottom-6 right-6 bg-purple-400 text-white p-3 rounded-full shadow-lg hover:bg-purple-500 transition-transform transform hover:scale-110 z-20">
        <SparklesIcon className="w-6 h-6" />
      </button>
      <AIAssistant 
        isOpen={isAiAssistantOpen} 
        onClose={() => setAiAssistantOpen(false)}
        repo={repo}
      />
    </div>
  );
};

export default RepoDetail;
