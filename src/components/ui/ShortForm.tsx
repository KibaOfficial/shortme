// Copyright (c) 2024 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";

const ShortForm: React.FC = () => {

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [code, setCode] = useState('');
  const [origin, setOrigin] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/create-short', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, origin })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-white mb-4">Create Short URL</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="mt-4 text-red-500">{error}</p>}
          {message && <p className="mt-4 text-green-500">{message}</p>}
          <div className="mb-6">
            <label htmlFor="code" className="block text-sm font-medium text-gray-300">
              Code
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="origin" className="block text-sm font-medium text-gray-300">
              Origin
            </label>
            <input
              id="origin"
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Short URL
          </button>
        </form>
      </div>
    </div>
  )
}

export default ShortForm;