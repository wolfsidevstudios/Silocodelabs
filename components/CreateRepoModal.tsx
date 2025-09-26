import React, { useState } from 'react';
import type { Repository } from '../types';
import { githubService, users } from '../services/githubService';
import LoadingSpinner from './LoadingSpinner';

interface CreateRepoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRepoCreated: (repo: Repository) => void;
}

const CreateRepoModal: React.FC<CreateRepoModalProps> = ({ isOpen, onClose, onRepoCreated }) => {
  const [repoName, setRepoName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoName.trim()) {
      setError('Repository name is required.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      // Assuming dev_one is the creator for this simulation
      const newRepo = await githubService.createRepository(repoName, description, users.dev_one); 
      onRepoCreated(newRepo);
      // Reset form for next time
      setRepoName('');
      setDescription('');
    } catch (err) {
      setError('Failed to create repository.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Create a new repository</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="repo-name" className="block text-sm font-medium text-gray-300 mb-1">Repository Name</label>
            <input
              id="repo-name"
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="my-awesome-project"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="repo-description" className="block text-sm font-medium text-gray-300 mb-1">Description (optional)</label>
            <textarea
              id="repo-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="A short description of your project."
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-4 pt-2">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50">
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