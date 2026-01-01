
import React, { useState, useEffect } from 'react';
import { Habit } from '../types';
import { backupToWebDAV, restoreFromWebDAV, WebDAVConfig } from '../utils/webdav';
import { saveAllHabits, clearAllDB } from '../db';

interface SettingsProps {
  habits: Habit[];
  onRefresh: () => Promise<void>;
}

const WEBDAV_STORAGE_KEY = 'tracker_webdav_config';

const Settings: React.FC<SettingsProps> = ({ habits, onRefresh }) => {
  const [config, setConfig] = useState<WebDAVConfig>({
    url: '',
    username: '',
    password: '',
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'loading' | null; message: string }>({
    type: null,
    message: '',
  });

  useEffect(() => {
    const savedConfig = localStorage.getItem(WEBDAV_STORAGE_KEY);
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.error('Failed to parse WebDAV config', e);
      }
    }
  }, []);

  const handleSaveConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newConfig = { ...config, [name]: value };
    setConfig(newConfig);
    localStorage.setItem(WEBDAV_STORAGE_KEY, JSON.stringify(newConfig));
  };

  const handleBackup = async () => {
    if (!config.url || !config.username || !config.password) {
      setStatus({ type: 'error', message: 'Please fill in all WebDAV fields.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Backing up...' });
    try {
      await backupToWebDAV(config, habits);
      setStatus({ type: 'success', message: 'Backup successful!' });
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || 'Backup failed.' });
    }
  };

  const handleRestore = async () => {
    if (!config.url || !config.username || !config.password) {
      setStatus({ type: 'error', message: 'Please fill in all WebDAV fields.' });
      return;
    }

    if (!confirm('This will overwrite all local data. Are you sure?')) {
      return;
    }

    setStatus({ type: 'loading', message: 'Restoring...' });
    try {
      const restoredHabits = await restoreFromWebDAV(config);
      await clearAllDB();
      await saveAllHabits(restoredHabits);
      await onRefresh();
      setStatus({ type: 'success', message: 'Restore successful!' });
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || 'Restore failed.' });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8">
      <h1 className="text-3xl font-serif italic text-[#413A2C]">Settings</h1>

      <div className="bg-[#FCFBFC] border border-[#DBDCD7] rounded-[28px] p-8 paper-shadow space-y-6">
        <div className="flex items-center gap-3 border-b border-[#DBDCD7] pb-4">
          <div className="text-xl">☁️</div>
          <h2 className="text-lg font-serif text-[#413A2C]">WebDAV Backup</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-[#726C62] font-medium ml-1">Server URL</label>
            <input
              type="text"
              name="url"
              value={config.url}
              onChange={handleSaveConfig}
              placeholder="https://example.com/dav"
              className="w-full bg-[#E9E8E2]/30 border border-[#DBDCD7] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#66AB71] transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-[#726C62] font-medium ml-1">Username</label>
              <input
                type="text"
                name="username"
                value={config.username}
                onChange={handleSaveConfig}
                className="w-full bg-[#E9E8E2]/30 border border-[#DBDCD7] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#66AB71] transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-[#726C62] font-medium ml-1">Password</label>
              <input
                type="password"
                name="password"
                value={config.password}
                onChange={handleSaveConfig}
                className="w-full bg-[#E9E8E2]/30 border border-[#DBDCD7] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#66AB71] transition-all"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <button
            onClick={handleBackup}
            disabled={status.type === 'loading'}
            className="bg-[#66AB71] text-white py-3 rounded-xl text-sm font-medium hover:brightness-105 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 paper-shadow"
          >
            Backup Now
          </button>
          <button
            onClick={handleRestore}
            disabled={status.type === 'loading'}
            className="border border-[#66AB71] text-[#66AB71] py-3 rounded-xl text-sm font-medium hover:bg-[#66AB71]/5 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
          >
            Restore Now
          </button>
        </div>

        {status.message && (
          <div className={`text-center py-2 px-4 rounded-lg text-xs font-medium animate-in zoom-in-95 duration-300 ${status.type === 'success' ? 'bg-[#66AB71]/10 text-[#66AB71]' :
            status.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-[#E9E8E2]/50 text-[#726C62]'
            }`}>
            {status.message}
          </div>
        )}

        <p className="text-[10px] text-[#726C62] text-center italic">
          Files will be backed up to the <code className="bg-[#E9E8E2] px-1 rounded">/tracker</code> directory.
        </p>
      </div>

      <div className="bg-[#FCFBFC] border border-[#DBDCD7] rounded-[28px] p-8 paper-shadow space-y-8">
        <div className="space-y-4 text-center py-4">
          <div className="w-16 h-16 bg-[#E9E8E2] rounded-[24px] mx-auto flex items-center justify-center text-3xl paper-shadow border border-white">
            📜
          </div>
          <div>
            <h2 className="text-lg font-serif text-[#413A2C]">Ethereal Habits</h2>
            <p className="text-[#726C62] text-[10px] italic">Mindful consistency on paper.</p>
          </div>
        </div>

        <div className="border-t border-[#DBDCD7] pt-6 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#726C62] font-medium uppercase tracking-widest text-[9px]">Version</span>
            <span className="text-[#413A2C] font-mono text-xs">{import.meta.env.VITE_APP_VERSION}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#726C62] font-medium uppercase tracking-widest text-[9px]">Repository</span>
            <a
              href="https://github.com/heerheer/tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#66AB71] hover:underline font-medium text-xs"
            >
              heerheer/tracker
            </a>
          </div>
        </div>

        <div className="pt-2 text-center">
          <p className="text-[9px] text-[#726C62] uppercase tracking-[0.2em]">Waiting for the settling, the lingering, and the fading, until it is a regret no more.</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
