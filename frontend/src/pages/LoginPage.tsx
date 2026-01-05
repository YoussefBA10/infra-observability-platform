import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 mb-4">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">DevOps Admin</h1>
            <p className="text-gray-400">Administration Dashboard</p>
          </div>

          <LoginForm />
        </div>

        <div className="mt-6 text-center text-xs text-gray-500 space-y-2">
          <p>© 2024 DevOps Admin Platform</p>
          <p>Secure dashboard for infrastructure management</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
