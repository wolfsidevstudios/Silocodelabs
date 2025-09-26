
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RepoIcon } from './icons/RepoIcon';

interface LayoutProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-900 border-b border-gray-700 p-4 flex items-center sticky top-0 z-10">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white hover:text-blue-500 transition-colors">
            <RepoIcon className="w-6 h-6" />
        </button>
        <div className="flex-1 min-w-0 ml-4">
            {typeof title === 'string' ? (
                 <h1 className="text-lg font-semibold text-gray-200 truncate">{title}</h1>
            ) : title}
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 bg-gray-950">
        {children}
      </main>
    </div>
  );
};

export default Layout;
