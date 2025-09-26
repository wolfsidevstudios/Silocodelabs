
export interface User {
  name: string;
  avatarUrl: string;
}

export interface Repository {
  id: string;
  name: string;
  description: string;
  owner: User;
  stars: number;
  forks: number;
  language: string;
  updatedAt: string;
}

export interface RepoContent {
  type: 'file' | 'dir';
  name: string;
  path: string;
  sha: string;
}

export interface Commit {
  sha: string;
  message: string;
  author: User;
  date: string;
}

export interface Comment {
    author: User;
    body: string;
}

export interface Issue {
  id: number;
  title: string;
  author: User;
  state: 'open' | 'closed';
  createdAt: string;
  body: string;
  comments: Comment[];
}

export interface PullRequest {
  id: number;
  title: string;
  author: User;
  state: 'open' | 'closed' | 'merged';
  createdAt: string;
}
