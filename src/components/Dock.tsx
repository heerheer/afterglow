import React from 'react';
import { TabType, Habit } from '../types';
import { useTranslation } from 'react-i18next';
import { useWebDAV } from '../hooks/useWebDAV';
import { motion, AnimatePresence } from 'framer-motion';

interface DockProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  habits: Habit[];
}

const Dock: React.FC<DockProps> = ({ activeTab, setActiveTab, habits }) => {
  const { t } = useTranslation();
  const { isConfigured, backup, status } = useWebDAV(habits);

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'home', label: t('nav.home'), icon: '✦' },
    { id: 'records', label: t('nav.records'), icon: '▤' },
    { id: 'settings', label: t('nav.settings'), icon: '⚙' },
  ];

  const handleQuickBackup = async () => {
    if (confirm(t('webdav.confirm-backup-msg'))) {
      await backup();
    }
  };

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
      <nav className="bg-card/90 backdrop-blur-xl border border-border rounded-full p-2 flex items-center gap-3 paper-shadow">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
            className={`
              relative w-12 h-12 flex items-center justify-center rounded-full transition-all duration-500 ease-out
              ${activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}
            `}
          >
            <span className="text-xl leading-none">{tab.icon}</span>
          </button>
        ))}
        {false && isConfigured && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleQuickBackup}
            disabled={status.type === 'loading'}
            className="h-14 px-6 rounded-full  hover:bg-primary/20  flex items-center gap-3 transition-all active:scale-95  group disabled:opacity-50"
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              {status.type === 'loading' ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : status.type === 'success' ? (
                '✓'
              ) : (
                '☁'
              )}
            </div>
            <div className="flex flex-col items-start pr-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70 leading-none">
                {status.type === 'loading' ? t('webdav.backing-up') : t('nav.backup')}
              </span>
              <span className="text-[9px] text-muted-foreground leading-tight">
                {status.type === 'success' ? t('webdav.backup-success') : t('webdav.title')}
              </span>
            </div>
          </motion.button>
        )}
      </nav>


    </div>
  );
};

export default Dock;
