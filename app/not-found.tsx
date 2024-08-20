// Copyright (c) 2024 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Link from 'next/link';

const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Oh-oh! Das hätte nicht passieren sollen</h1>
        <p className="text-lg mb-8">Die Seite, die du versuchst aufzurufen, gibt es wohl nicht.</p>
        <Link href="/" legacyBehavior>
          <a className="bg-blue-700 text-white hover:bg-blue-800 px-4 py-2 rounded uppercase">
            Hier geht&apos;s zurück
          </a>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
