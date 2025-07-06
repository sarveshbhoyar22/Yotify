import React, { useState } from "react";
import { Plus, Music } from "lucide-react";
import { VideoResult } from "../types";

interface Playlist {
  name: string;
  songs: VideoResult[];
}

export const Library: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newName, setNewName] = useState("");

  const handleCreate = () => {
    const trimmed = newName.trim();
    if (trimmed && !playlists.find((p) => p.name === trimmed)) {
      setPlaylists([...playlists, { name: trimmed, songs: [] }]);
      setNewName("");
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl mt-8 text-white">
      <h2 className="text-xl font-semibold mb-4">🎶 Your Library</h2>

      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New playlist name"
          className="flex-1 px-4 py-2 rounded-md bg-gray-900 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleCreate}
          disabled={!newName.trim()}
          className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
        >
          <Plus className="w-4 h-4 inline mr-1" />
          Create
        </button>
      </div>

      {playlists.length === 0 ? (
        <p className="text-gray-400">No playlists created yet.</p>
      ) : (
        playlists.map((playlist, i) => (
          <div key={i} className="mb-4">
            <h3 className="font-semibold text-lg">{playlist.name}</h3>
            {playlist.songs.length === 0 ? (
              <p className="text-sm text-gray-500">No songs yet.</p>
            ) : (
              <ul className="mt-2 space-y-1 text-sm text-gray-300">
                {playlist.songs.map((song, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-purple-400" />
                    {song.title} — {song.channel}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </div>
  );
};
