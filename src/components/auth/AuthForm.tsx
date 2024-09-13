// Copyright (c) 2024 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../ui/button';

const AuthForm = () => {
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');
    setMessage('');

    try {
      const response = await fetch(`/api/${authMode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        if (authMode === 'login') {
          router.push('/dashboard');
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-white mb-4">
          {authMode === 'register' ? 'Register' : 'Login'}
        </h2>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          {error && <p className="mt-4 text-red-500">{error}</p>}
          {message && <p className="mt-4 text-green-500">{message}</p>}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <Button
            variant="primary"
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {authMode === 'register' ? 'Register' : 'Login'}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            onClick={() => setAuthMode(authMode === 'register' ? 'login' : 'register')}
            className="text-blue-500 hover:text-blue-700"
          >
            {authMode === 'register' ? 'Already have an account? Login' : 'Need an account? Register'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
