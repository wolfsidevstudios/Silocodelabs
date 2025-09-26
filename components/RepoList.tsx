
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import githubService from '../services/githubService';
import type { Repository } from '../types';
import LoadingSpinner from './LoadingSpinner';
import CreateRepoModal from './CreateRepoModal';
import { PlusIcon } from './icons/PlusIcon';

const RepoList: React.FC = () => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchRepos = async () => {
      setIsLoading(true);
      const data = await githubService.getRepositories();
      setRepos(data);
      setIsLoading(false);
    };
    fetchRepos();
  }, []);

  const handleRepoCreated = (newRepo: Repository) => {
    setRepos(prevRepos => [newRepo, ...prevRepos]);
    setIsModalOpen(false);
  }

  return (
    <Layout
      title="My Repositories"
      headerActions={
        <button onClick={() => setIsModalOpen(true)} className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white">
          <PlusIcon className="w-5 h-5" />
        </button>
      }
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <LoadingSpinner />
        </div>
      ) : (
        <ul className="space-y-3">
          {repos.map((repo) => (
            <li key={repo.id} className="bg-gray-900 border border-gray-700 rounded-lg shadow-md hover:border-blue-500 transition-all">
              <Link to={`/repo/${repo.id}`} className="block p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-blue-400 truncate">{repo.name}</h2>
                  <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">{repo.language}</span>
                </div>
                <p className="text-sm text-gray-300 mt-2 truncate">{repo.description}</p>
                <div className="flex items-center text-xs text-gray-500 mt-3 space-x-4">
                  <span>⭐ {repo.stars}</span>
                  <span>forks: {repo.forks}</span>
                  <span>Updated {new Date(repo.updatedAt).toLocaleDateString()}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <CreateRepoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onRepoCreated={handleRepoCreated}
      />
    </Layout>
  );
};

export default RepoList;
