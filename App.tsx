
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RepoList from './components/RepoList';
import RepoDetail from './components/RepoDetail';

function App() {
  return (
    <div className="min-h-screen font-sans">
      <Routes>
        <Route path="/" element={<RepoList />} />
        <Route path="/repo/:repoId/*" element={<RepoDetail />} />
      </Routes>
    </div>
  );
}

export default App;
