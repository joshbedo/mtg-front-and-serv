import React from 'react';
import { Users } from 'lucide-react';

export function EmptyLobbyState() {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
        <Users size={32} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No Active Lobbies</h3>
      <p className="text-gray-400">
        Create a new lobby to start playing with friends!
      </p>
    </div>
  );
}