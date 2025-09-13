import { SignIn } from '@clerk/clerk-react';
import React from 'react';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full">
        <SignIn
          routing="path"
          path="/login"
          signUpUrl="/register"
          fallbackRedirectUrl="/cybercafe"
          signUpFallbackRedirectUrl="/cybercafe"
        />
      </div>
    </div>
  );
};

export default Login;