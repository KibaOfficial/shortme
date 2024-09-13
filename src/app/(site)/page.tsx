// Copyright (c) 2024 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
"use client";
import { Button } from "@/components/ui/button";
import Logger from "@/lib/logger";
import { useRouter } from "next/navigation";

const Home: React.FC = () => {
  const router = useRouter();

  const handleClick = () => {
    Logger({ status: "DEBUG", message: "Button clicked" });
    router.push("/auth");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold text-white">ShortMe</h1>
        <p className="text-lg text-gray-300">Simplify Your URLs Effortlessly</p>
        <Button
          variant="primary"
          size="lg"
          className="mt-4"
          onClick={handleClick}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Home;
