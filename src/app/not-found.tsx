// Copyright (c) 2024 KibaOfficial
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client"
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const NotFound: React.FC = () => {

  const router = useRouter()
  const handleButton = () => {
    router.push("/")
  }
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">Oh-oh! Das hätte nicht passieren sollen</h1>
        <p className="text-lg mb-8 text-white">Die Seite, die du versuchst aufzurufen, gibt es wohl nicht.</p>
        <Button
          onClick={handleButton}
          variant="primary"
          >
          Hier geht&apos;s zurück
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
