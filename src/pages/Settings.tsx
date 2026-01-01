
import React, { useState, useEffect } from 'react';
import { Habit, WidgetConfig } from '../types';
import WebDAVSettings from '../components/webdav/WebDAVSettings';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsProps {
  habits: Habit[];
  onRefresh: () => Promise<void>;
}

const WIDGET_STORAGE_KEY = 'tracker_widget_config';

const DEFAULT_WIDGET_CONFIG: WidgetConfig = {
  heatmap: false,
  quote: false,
  capsule: {
    enabled: false,
    title: 'Countdown',
    description: '',
    targetDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  },
};

const Settings: React.FC<SettingsProps> = ({ habits, onRefresh }) => {
  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig>(DEFAULT_WIDGET_CONFIG);

  useEffect(() => {
    const savedWidgetConfig = localStorage.getItem(WIDGET_STORAGE_KEY);
    if (savedWidgetConfig) {
      try {
        setWidgetConfig(JSON.parse(savedWidgetConfig));
      } catch (e) {
        console.error('Failed to parse Widget config', e);
      }
    }
  }, []);

  const handleSaveWidgetConfig = (newConfig: WidgetConfig) => {
    setWidgetConfig(newConfig);
    localStorage.setItem(WIDGET_STORAGE_KEY, JSON.stringify(newConfig));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8">
      <h1 className="text-3xl font-serif italic text-[#413A2C]">Settings</h1>

      <WebDAVSettings habits={habits} onRefresh={onRefresh} />

      <div className="bg-[#FCFBFC] border border-[#DBDCD7] rounded-[28px] p-8 paper-shadow space-y-6">
        <div className="flex items-center gap-3 border-b border-[#DBDCD7] pb-4">
          <div className="text-xl">🧩</div>
          <h2 className="text-lg font-serif text-[#413A2C]">Widgets</h2>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-serif text-[#413A2C]">Heatmap</h3>
              <p className="text-[10px] text-[#726C62]">Display 30-day activity consistency.</p>
            </div>
            <button
              onClick={() => handleSaveWidgetConfig({ ...widgetConfig, heatmap: !widgetConfig.heatmap })}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${widgetConfig.heatmap ? 'bg-[#66AB71]' : 'bg-[#E9E8E2]'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${widgetConfig.heatmap ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-serif text-[#413A2C]">Daily Quote</h3>
              <p className="text-[10px] text-[#726C62]">Inspiring word from Hitokoto API.</p>
            </div>
            <button
              onClick={() => handleSaveWidgetConfig({ ...widgetConfig, quote: !widgetConfig.quote })}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${widgetConfig.quote ? 'bg-[#66AB71]' : 'bg-[#E9E8E2]'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${widgetConfig.quote ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-serif text-[#413A2C]">Future Capsule</h3>
                <p className="text-[10px] text-[#726C62]">Countdown to a special moment.</p>
              </div>
              <button
                onClick={() => handleSaveWidgetConfig({
                  ...widgetConfig,
                  capsule: { ...widgetConfig.capsule, enabled: !widgetConfig.capsule.enabled }
                })}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${widgetConfig.capsule.enabled ? 'bg-[#66AB71]' : 'bg-[#E9E8E2]'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${widgetConfig.capsule.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {widgetConfig.capsule.enabled && (
              <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#726C62] font-medium ml-1">Title</label>
                  <input
                    type="text"
                    value={widgetConfig.capsule.title}
                    onChange={(e) => handleSaveWidgetConfig({
                      ...widgetConfig,
                      capsule: { ...widgetConfig.capsule, title: e.target.value }
                    })}
                    placeholder="Event Title"
                    className="w-full bg-[#E9E8E2]/30 border border-[#DBDCD7] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#66AB71] transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#726C62] font-medium ml-1">Target Date</label>
                  <input
                    type="date"
                    value={widgetConfig.capsule.targetDate}
                    onChange={(e) => handleSaveWidgetConfig({
                      ...widgetConfig,
                      capsule: { ...widgetConfig.capsule, targetDate: e.target.value }
                    })}
                    className="w-full bg-[#E9E8E2]/30 border border-[#DBDCD7] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#66AB71] transition-all"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-[#726C62] font-medium ml-1">Description</label>
                  <input
                    type="text"
                    value={widgetConfig.capsule.description}
                    onChange={(e) => handleSaveWidgetConfig({
                      ...widgetConfig,
                      capsule: { ...widgetConfig.capsule, description: e.target.value }
                    })}
                    placeholder="Brief objective (optional)"
                    className="w-full bg-[#E9E8E2]/30 border border-[#DBDCD7] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#66AB71] transition-all"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
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
