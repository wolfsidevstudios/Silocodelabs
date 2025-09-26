
import React, { useState } from 'react';
import githubService from '../services/githubService';
import type { Repository } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface CreateRepoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRepoCreated: (repo: Repository) => void;
}

const CreateRepoModal: React.FC<CreateRepoModalProps> = ({ isOpen, onClose, onRepoCreated }) => {
  const [repoName, setRepoName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoName.trim()) {
      setError('Repository name is required.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const newRepo = await githubService.createRepository(repoName, description);
      onRepoCreated(newRepo);
      setRepoName('');
      setDescription('');
    } catch (err) {
      setError('Failed to create repository.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-5 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Create New Repository</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-4">
            <div>
              <label htmlFor="repo-name" className="block text-sm font-medium text-gray-300 mb-1">
                Repository Name
              </label>
              <input
                id="repo-name"
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="repo-desc" className="block text-sm font-medium text-gray-300 mb-1">
                Description (optional)
              </label>
              <textarea
                id="repo-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <div className="p-5 bg-gray-800 rounded-b-lg flex justify-end items-center gap-3">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-700">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-500 disabled:bg-blue-800 flex items-center gap-2">
              {isLoading && <LoadingSpinner size="sm" />}
              Create Repository
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRepoModal;
