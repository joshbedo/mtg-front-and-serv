import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface CreateLobbyFormProps {
  onCreateLobby: (name: string) => void;
}

export function CreateLobbyForm({ onCreateLobby }: CreateLobbyFormProps) {
  const [newLobbyName, setNewLobbyName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLobbyName.trim()) {
      onCreateLobby(newLobbyName.trim());
      setNewLobbyName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={newLobbyName}
        onChange={(e) => setNewLobbyName(e.target.value)}
        placeholder="New lobby name..."
        className="px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
      >
        <Plus size={20} />
        Create Lobby
      </button>
    </form>
  );
}