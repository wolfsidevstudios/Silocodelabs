
import React from 'react';

const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-4',
        lg: 'w-12 h-12 border-4',
    };

    return (
        <div className={`animate-spin rounded-full ${sizeClasses[size]} border-blue-500 border-t-transparent`}></div>
    );
};

export default LoadingSpinner;
