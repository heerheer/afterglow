import React from 'react';
import { TabType } from '../types';
import { useTranslation } from 'react-i18next';

interface DockProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const Dock: React.FC<DockProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'home', label: t('nav.home'), icon: '✦' },
    { id: 'records', label: t('nav.records'), icon: '▤' },
    { id: 'settings', label: t('nav.settings'), icon: '⚙' },
  ];

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
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
      </nav>
    </div>
  );
};

export default Dock;
