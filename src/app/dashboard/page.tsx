// Copyright (c) 2024 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import CodeList from "@/components/ui/CodeList";
import ShortForm from "@/components/ui/ShortForm";

const DashboardPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
          <p className="text-lg">Manage your shortened URLs and create new ones.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <ShortForm />
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <CodeList />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
