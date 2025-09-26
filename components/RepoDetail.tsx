
import React, { useState, useEffect } from 'react';
import { useParams, Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import githubService from '../services/githubService';
import type { Repository } from '../types';
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
  const [isLoading, setIsLoading] = useState(true);
  const [isAIOpen, setIsAIOpen] = useState(false);

  useEffect(() => {
    const fetchRepo = async () => {
      if (!repoId) return;
      setIsLoading(true);
      const data = await githubService.getRepository(repoId);
      if (data) {
        setRepo(data);
      } else {
        // Handle repo not found, maybe navigate to a 404 page or back to the list
        navigate('/');
      }
      setIsLoading(false);
    };
    fetchRepo();
  }, [repoId, navigate]);

  if (isLoading || !repo) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const navItems = [
    { path: 'code', label: 'Code', icon: CodeIcon },
    { path: 'commits', label: 'Commits', icon: CommitIcon },
    { path: 'issues', label: 'Issues', icon: IssueIcon },
    { path: 'prs', label: 'Pull Requests', icon: PullRequestIcon },
  ];

  const getBasePath = () => `/repo/${repoId}`;
  
  // Redirect base repo path to code tab
  useEffect(() => {
    if (location.pathname === getBasePath() || location.pathname === `${getBasePath()}/`) {
      navigate(`${getBasePath()}/code`, { replace: true });
    }
  }, [location.pathname, navigate, repoId]);

  return (
    <Layout
      title={
        <div className="flex flex-col min-w-0">
            <span className="text-xs text-blue-400">{repo.owner.name}</span>
            <h1 className="text-lg font-semibold text-gray-200 truncate">{repo.name}</h1>
        </div>
      }
      headerActions={
        <button onClick={() => setIsAIOpen(true)} className="p-2 rounded-full bg-purple-500 hover:bg-purple-400 text-white">
          <SparklesIcon className="w-5 h-5" />
        </button>
      }
    >
      <div className="flex flex-col h-full">
        <nav className="border-b border-gray-700 mb-4">
          <ul className="flex space-x-2 -mb-px overflow-x-auto">
            {navItems.map(item => (
              <li key={item.path}>
                <NavLink
                  to={`${getBasePath()}/${item.path}`}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      isActive
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex-1">
           <Routes>
            <Route path="code/*" element={<CodeViewer repo={repo} />} />
            <Route path="commits" element={<CommitsView repoId={repo.id} />} />
            <Route path="issues" element={<IssuesView repoId={repo.id} />} />
            <Route path="prs" element={<PRsView repoId={repo.id} />} />
          </Routes>
        </div>
      </div>
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} repo={repo} />
    </Layout>
  );
};


// Helper components to fetch data for each tab
const CommitsView: React.FC<{repoId: string}> = ({repoId}) => {
    const [commits, setCommits] = useState<Awaited<ReturnType<typeof githubService.getCommits>>>([]);
    useEffect(() => {
        githubService.getCommits(repoId).then(setCommits);
    }, [repoId]);
    return <CommitList commits={commits} />;
};

const IssuesView: React.FC<{repoId: string}> = ({repoId}) => {
    const [issues, setIssues] = useState<Awaited<ReturnType<typeof githubService.getIssues>>>([]);
    useEffect(() => {
        githubService.getIssues(repoId).then(setIssues);
    }, [repoId]);
    return <IssueList issues={issues} />;
};

const PRsView: React.FC<{repoId: string}> = ({repoId}) => {
    const [prs, setPrs] = useState<Awaited<ReturnType<typeof githubService.getPullRequests>>>([]);
    useEffect(() => {
        githubService.getPullRequests(repoId).then(setPrs);
    }, [repoId]);
    return <PRList pullRequests={prs} />;
};


export default RepoDetail;
