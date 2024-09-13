// Copyright (c) 2024 KibaOfficial
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

"use client";

import Logger from "@/lib/logger";
import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { Button } from "./button";

interface Link {
  code: string;
  origin: string;
  click_count: number;
}

const CodeList: React.FC = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (code: string) => {
    try {
      const response = await fetch("/api/delete-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })

      if (response.ok) {
        setLinks((prevLinks) => prevLinks.filter((link) => link.code !== code));
        Logger({ status: "INFO", message: `Code ${code} deleted successfully.` });
      } else {
        Logger({ status: "ERROR", message: `Failed to delete code: ${code}` });
      }
      
    } catch (error) {
      Logger({ status: "ERROR", message: `Failed to delete code: ${error}`})
    }
  }

  useEffect(() => {
    async function fetchLinks() {
      try {
        const response = await fetch('/api/get-codes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({}) 
        });

        const data = await response.json();

        if (data.status !== 200) {
          setError(data.message);
        } else {
          setLinks(data.links);
        }
      } catch (err) {
        setError('Failed to load links');
      } finally {
        setLoading(false);
      }
    }

    fetchLinks();
  }, []);

  if (loading) return <p className="text-gray-400">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Links</h2>
      {links.length === 0 ? (
        <p>No links found.</p>
      ) : (
        <table className="min-w-full bg-gray-800 rounded-lg shadow-md">
          <thead>
            <tr className="text-left border-b border-gray-700">
              <th className="px-6 py-3 text-gray-300">Code</th>
              <th className="px-6 py-3 text-gray-300">Origin</th>
              <th className="px-6 py-3 text-gray-300">Clicks</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.code} className="border-b border-gray-700">
                <td className="px-6 py-4 text-white">{link.code}</td>
                <td className="px-6 py-4">
                  <a
                    href={link.origin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {link.origin}
                  </a>
                </td>
                <td className="px-6 py-4 text-white">{link.click_count}</td>
                <td className="px-6 py-4 text-white">
                <Button
                    variant="link"
                    onClick={() => handleDelete(link.code)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiX size={20} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CodeList;
