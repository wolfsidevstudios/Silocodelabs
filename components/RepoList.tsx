import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { githubService } from '../services/githubService';
import type { Repository } from '../types';
import { RepoIcon } from './icons/RepoIcon';
import { PlusIcon } from './icons/PlusIcon';
import Layout from './Layout';
import LoadingSpinner from './LoadingSpinner';
import CreateRepoModal from './CreateRepoModal';

const RepoCard: React.FC<{ repo: Repository }> = ({ repo }) => (
  <Link to={`/repo/${repo.id}/code`} className="block bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-all duration-200">
    <div className="flex items-center mb-2">
      <RepoIcon className="w-5 h-5 text-gray-500 mr-2" />
      <span className="text-blue-500 font-semibold">{repo.name}</span>
    </div>
    <p className="text-gray-400 text-sm mb-3">{repo.description}</p>
    <div className="flex items-center text-xs text-gray-500 gap-4">
        <div className="flex items-center gap-1">
            <img src={repo.owner.avatarUrl} alt={repo.owner.name} className="w-4 h-4 rounded-full" />
            <span>{repo.owner.name}</span>
        </div>
        <span>⭐ {repo.stars.toLocaleString()}</span>
        <span> Forks: {repo.forks.toLocaleString()}</span>
    </div>
  </Link>
);

const RepoList: React.FC = () => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);
      const data = await githubService.getRepositories();
      setRepos(data);
      setLoading(false);
    };
    fetchRepos();
  }, []);

  const handleRepoCreated = (newRepo: Repository) => {
    setRepos(prevRepos => [newRepo, ...prevRepos]);
    setIsModalOpen(false);
    navigate(`/repo/${newRepo.id}/code`);
  };

  const filteredRepos = repos.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Repositories">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
             <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors"
            >
                <PlusIcon className="w-5 h-5" />
                New
            </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
             <LoadingSpinner />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRepos.map(repo => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        )}
      </div>
      <CreateRepoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRepoCreated={handleRepoCreated}
      />
    </Layout>
  );
};

export default RepoList;