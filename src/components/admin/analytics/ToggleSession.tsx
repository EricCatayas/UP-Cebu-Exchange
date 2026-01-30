'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ToggleSession() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [session, setSession] = useState(searchParams.get('session') || 'all');

  const handleToggleSession = (value: 'unique' | 'all') => {
    setSession(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set('session', value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <input
          type="radio"
          id="session-all"
          name="session"
          value="all"
          checked={session === 'all'}
          onChange={() => handleToggleSession('all')}
          className="cursor-pointer"
        />
        <label htmlFor="session-all" className="cursor-pointer relative group">
          <span className="font-medium">All Sessions</span>
          <span className="absolute left-0 top-full mt-1 hidden group-hover:block text-sm text-gray-600">
            Count each session separately, including multiple sessions from the same user
          </span>
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="radio"
          id="session-unique"
          name="session"
          value="unique"
          checked={session === 'unique'}
          onChange={() => handleToggleSession('unique')}
          className="cursor-pointer"
        />
        <label htmlFor="session-unique" className="cursor-pointer relative group">
          <span className="font-medium">Unique Users</span>
          <span className="absolute left-0 top-full mt-1 hidden group-hover:block text-sm text-gray-600">
            Count each user once, regardless of the number of sessions
          </span>
        </label>
      </div>
    </div>
  );
}
