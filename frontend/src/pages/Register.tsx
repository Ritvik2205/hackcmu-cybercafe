import { SignUp } from '@clerk/clerk-react';
import React from 'react';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full">
        <SignUp
          routing="path"
          path="/register"
          signInUrl="/login"
        />
      </div>
    </div>
  );
};

export default Register;