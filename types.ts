
export interface User {
  name: string;
  avatarUrl: string;
}

export interface FileContent {
  type: 'file' | 'dir';
  name: string;
  path: string;
  content?: string;
}

export interface Commit {
  sha: string;
  author: User;
  message: string;
  date: string;
}

export interface Comment {
  author: User;
  body: string;
  date: string;
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
    body: string;
    comments: Comment[];
}


export interface Repository {
  id: string;
  name: string;
  owner: User;
  description: string;
  stars: number;
  forks: number;
  files: FileContent[];
  commits: Commit[];
  issues: Issue[];
  pullRequests: PullRequest[];
}
