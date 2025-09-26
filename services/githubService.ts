
import type { Repository, RepoContent, Commit, Issue, PullRequest, User } from '../types';

const mockUser: User = {
  name: 'CodePod AI',
  avatarUrl: 'https://avatars.githubusercontent.com/u/1089146?v=4',
};

const mockRepos: Repository[] = [
  {
    id: 'codepod-app',
    name: 'codepod-app',
    description: 'A mobile-first GitHub repository explorer built with React and Tailwind CSS, featuring AI-powered code explanations and chat.',
    owner: mockUser,
    stars: 123,
    forks: 45,
    language: 'TypeScript',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'awesome-prompts',
    name: 'awesome-prompts',
    description: 'A collection of curated prompts for large language models.',
    owner: mockUser,
    stars: 5678,
    forks: 910,
    language: 'Markdown',
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const mockContents: { [key: string]: RepoContent[] } = {
    'codepod-app': [
        { type: 'dir', name: 'src', path: 'src', sha: 'sha1' },
        { type: 'file', name: 'package.json', path: 'package.json', sha: 'sha2' },
        { type: 'file', name: 'README.md', path: 'README.md', sha: 'sha3' },
    ],
    'codepod-app/src': [
        { type: 'dir', name: 'components', path: 'src/components', sha: 'sha4' },
        { type: 'dir', name: 'services', path: 'src/services', sha: 'sha5' },
        { type: 'file', name: 'index.tsx', path: 'src/index.tsx', sha: 'sha6' },
    ],
};

const mockFileContent: { [key: string]: string } = {
    'codepod-app/package.json': JSON.stringify({
        "name": "codepod-app",
        "version": "0.1.0",
        "private": true,
        "dependencies": {
            "@google/genai": "^0.1.0",
            "react": "^18.2.0",
            "react-dom": "^18.2.0",
            "react-router-dom": "^6.10.0"
        }
    }, null, 2),
    'codepod-app/README.md': '# CodePod App\n\nA mobile-first GitHub repository explorer.',
    'codepod-app/src/index.tsx': `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\n\nconst root = ReactDOM.createRoot(document.getElementById('root'));\nroot.render(<App />);`
};


const mockCommits: Commit[] = [
    { sha: 'c1a2b3', message: 'feat: Initial commit with project structure', author: mockUser, date: new Date(Date.now() - 86400000 * 3).toISOString() },
    { sha: 'd4e5f6', message: 'feat: Add AI assistant feature', author: mockUser, date: new Date(Date.now() - 86400000 * 2).toISOString() },
    { sha: 'g7h8i9', message: 'fix: Improve UI responsiveness on mobile', author: mockUser, date: new Date(Date.now() - 86400000 * 1).toISOString() },
];

const mockIssues: Issue[] = [
    { id: 1, title: 'Bug: Chat window does not scroll properly', author: mockUser, state: 'open', createdAt: new Date().toISOString(), body: 'The chat message list does not automatically scroll to the bottom when a new message arrives.', comments: [{author: mockUser, body: "I'll take a look at this."}] },
    { id: 2, title: 'Feature Request: Add dark mode toggle', author: mockUser, state: 'closed', createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), body: 'It would be great to have a dark mode option for the UI.', comments: [] },
];

const mockPRs: PullRequest[] = [
    { id: 1, title: 'feat: Implement README rendering', author: mockUser, state: 'merged', createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
    { id: 2, title: 'fix: Correct typo in API service', author: mockUser, state: 'open', createdAt: new Date().toISOString() },
];

const githubService = {
  getRepositories: async (): Promise<Repository[]> => {
    await new Promise(res => setTimeout(res, 500));
    return mockRepos;
  },
  getRepository: async (repoId: string): Promise<Repository | undefined> => {
    await new Promise(res => setTimeout(res, 500));
    return mockRepos.find(r => r.id === repoId);
  },
  getRepoContents: async (repoId: string, path: string = ''): Promise<RepoContent[]> => {
    await new Promise(res => setTimeout(res, 500));
    const key = path ? `${repoId}/${path}` : repoId;
    return mockContents[key] || [];
  },
  getFileContent: async (repoId: string, path: string): Promise<string> => {
    await new Promise(res => setTimeout(res, 300));
    const key = `${repoId}/${path}`;
    return mockFileContent[key] || 'File content not found.';
  },
  getCommits: async (repoId: string): Promise<Commit[]> => {
    await new Promise(res => setTimeout(res, 500));
    return repoId === 'codepod-app' ? mockCommits : [];
  },
  getIssues: async (repoId: string): Promise<Issue[]> => {
    await new Promise(res => setTimeout(res, 500));
    return repoId === 'codepod-app' ? mockIssues : [];
  },
  getPullRequests: async (repoId: string): Promise<PullRequest[]> => {
    await new Promise(res => setTimeout(res, 500));
    return repoId === 'codepod-app' ? mockPRs : [];
  },
  createRepository: async (name: string, description: string): Promise<Repository> => {
      await new Promise(res => setTimeout(res, 1000));
      const newRepo: Repository = {
          id: name.toLowerCase().replace(/ /g, '-'),
          name,
          description,
          owner: mockUser,
          stars: 0,
          forks: 0,
          language: 'N/A',
          updatedAt: new Date().toISOString()
      };
      mockRepos.unshift(newRepo);
      return newRepo;
  }
};

export default githubService;
