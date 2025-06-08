import React from 'react';
import AuthForm from '@/features/auth/ui/AuthForm';

const AuthPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <AuthForm />
    </div>
  );
};

export default AuthPage;