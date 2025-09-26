// FIX: Import the `FileContent` type from `../types` to resolve the 'Cannot find name' errors.
import type { Repository, FileContent, User } from '../types';

export const users = {
  dev_one: { name: 'Alex Doe', avatarUrl: 'https://picsum.photos/seed/alex/40/40' },
  dev_two: { name: 'Jamie Smith', avatarUrl: 'https://picsum.photos/seed/jamie/40/40' },
};

const mockRepos: Repository[] = [
  {
    id: 'react-dashboard',
    name: 'react-dashboard',
    owner: users.dev_one,
    description: 'A cutting-edge dashboard built with React, TypeScript, and Tailwind CSS.',
    stars: 1250,
    forks: 340,
    files: [
      { type: 'dir', name: 'src', path: 'src' },
      { type: 'file', name: 'package.json', path: 'package.json', content: '{\n  "name": "react-dashboard",\n  "version": "1.0.0"\n}' },
      { type: 'file', name: 'README.md', path: 'README.md', content: '# React Dashboard\nThis is a sample README file.' },
      { type: 'dir', name: 'src/components', path: 'src/components' },
      { type: 'file', name: 'src/App.tsx', path: 'src/App.tsx', content: 'import React from "react";\n\nfunction App() {\n  return <h1>Hello, World!</h1>;\n}\n\nexport default App;' },
      { type: 'file', name: 'src/components/Button.tsx', path: 'src/components/Button.tsx', content: 'const Button = () => <button>Click me</button>; export default Button;' },
    ],
    commits: [
      { sha: 'a1b2c3d', author: users.dev_one, message: 'feat: Initial commit', date: '2024-07-20T10:00:00Z' },
      { sha: 'e4f5g6h', author: users.dev_two, message: 'fix: Corrected typo in README', date: '2024-07-21T14:30:00Z' },
      { sha: 'i7j8k9l', author: users.dev_one, message: 'feat: Add Button component', date: '2024-07-22T09:15:00Z' },
    ],
    issues: [
      { id: 1, title: 'Button component not rendering correctly on mobile', author: users.dev_two, state: 'open', createdAt: '2024-07-22T11:00:00Z', body: 'The button component seems to have alignment issues on smaller viewports.', comments: [{ author: users.dev_one, body: 'Looking into this now.', date: '2024-07-22T11:05:00Z' }] },
      { id: 2, title: 'Update documentation for API usage', author: users.dev_one, state: 'closed', createdAt: '2024-07-20T18:00:00Z', body: 'We need to add a section about the new API endpoints.', comments: [] },
    ],
    pullRequests: [
       { id: 1, title: 'feat: Add dark mode toggle', author: users.dev_two, state: 'open', createdAt: '2024-07-23T10:00:00Z', body: 'This PR introduces a dark mode toggle to enhance user experience.', comments: [{author: users.dev_one, body: "Great work! Just one small suggestion.", date: "2024-07-23T11:00:00Z"}] },
    ]
  },
  {
    id: 'gemini-ai-chat',
    name: 'gemini-ai-chat',
    owner: users.dev_two,
    description: 'A chat application powered by the Google Gemini API for intelligent conversations.',
    stars: 3400,
    forks: 890,
    files: [
        { type: 'dir', name: 'src', path: 'src' },
        { type: 'file', name: 'README.md', path: 'README.md', content: '# Gemini AI Chat' },
    ],
    commits: [
        { sha: 'z1y2x3w', author: users.dev_two, message: 'Initial commit', date: '2024-07-25T12:00:00Z' }
    ],
    issues: [
        { id: 1, title: 'Improve response streaming', author: users.dev_one, state: 'open', createdAt: '2024-07-26T15:00:00Z', body: 'The streaming response feels a bit choppy. We can improve the UX here.', comments: [] }
    ],
    pullRequests: []
  }
];

export const githubService = {
  getRepositories: async (): Promise<Repository[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockRepos), 500));
  },
  getRepository: async (id: string): Promise<Repository | undefined> => {
    return new Promise(resolve => setTimeout(() => resolve(mockRepos.find(repo => repo.id === id)), 500));
  },
  getFiles: async (repoId: string, path: string): Promise<FileContent[]> => {
    const repo = mockRepos.find(r => r.id === repoId);
    if (!repo) return [];
    if (path === '/') {
        return repo.files.filter(f => !f.path.includes('/'));
    }
    return repo.files.filter(f => f.path.startsWith(path + '/') && f.path.split('/').length === path.split('/').length + 1);
  },
  getFileContent: async (repoId: string, path: string): Promise<FileContent | undefined> => {
    const repo = mockRepos.find(r => r.id === repoId);
    if (!repo) return undefined;
    return repo.files.find(f => f.path === path);
  },
  createRepository: async (name: string, description: string, owner: User): Promise<Repository> => {
    return new Promise(resolve => {
        const newRepo: Repository = {
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name,
            owner,
            description,
            stars: 0,
            forks: 0,
            files: [
                {
                    type: 'file',
                    name: 'README.md',
                    path: 'README.md',
                    content: `# ${name}\n\n${description}`,
                },
            ],
            commits: [
                {
                    sha: 'init001',
                    author: owner,
                    message: 'Initial commit',
                    date: new Date().toISOString(),
                },
            ],
            issues: [],
            pullRequests: [],
        };
        mockRepos.unshift(newRepo); // Add to the beginning of the list
        setTimeout(() => resolve(newRepo), 500);
    });
  }
};