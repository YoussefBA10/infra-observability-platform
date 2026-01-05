import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const Loader = ({ size = 'md', message }: LoaderProps) => {
  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`${sizeStyles[size]} border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin`} />
      {message && <p className="text-gray-400 text-sm">{message}</p>}
    </div>
  );
};

export default Loader;