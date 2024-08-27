// Copyright (c) 2024 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default async function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold">ShortMe</h1>
          <p className="text-lg text-gray-300">The Dashboard you&apos;re looking for is currently a work in progress.</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
