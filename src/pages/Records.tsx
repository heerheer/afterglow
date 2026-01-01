
import React, { useState } from 'react';
import { Habit } from '../types';
import CalendarView from '../components/CalendarView';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface RecordsProps {
  habits: Habit[];
  onDelete: (id: string) => void;
  onSetMain: (id: string) => void;
  onAdd: (habit: any) => void;
  onToggleLog: (id: string, date: string, mood?: string) => void;
  onUpdateMood: (id: string, date: string, mood: string) => void;
}

const EMOJI_CATEGORIES = [
  { name: 'Smileys', icons: ['😊', '🥰', '✨', '🧘', '🌿', '🌱', '☀️', '🌙', '⭐', '☁️', '🌊', '🌈', '🔥', '💧'] },
  { name: 'Health', icons: ['🍎', '🍓', '🍵', '🥗', '🥤', '💪', '🏃', '🚶', '🚴', '🏊', '🧘', '🛀', '🛌', '💊'] },
  { name: 'Mind', icons: ['📖', '✍️', '🎨', '🧠', '🎧', '🎸', '📷', '💻', '💡', '📌', '📅', '🔍', '♟️', '🎮'] },
  { name: 'Nature', icons: ['🌸', '🌻', '🌲', '🍀', '🍂', '🍄', '🏔️', '🏜️', '🐾', '🦋', '🐝', '🦉', '🦊', '🐋'] },
  { name: 'Life', icons: ['🏠', '🧹', '🧺', '🍳', '☕', '🍷', '🚲', '🚗', '✈️', '👜', '🔑', '💰', '🎁', '🎈'] }
];

const Records: React.FC<RecordsProps> = ({ habits, onDelete, onSetMain, onAdd, onToggleLog, onUpdateMood }) => {
  const { t } = useTranslation();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newIcon, setNewIcon] = useState('✨');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAdd({
      title: newTitle,
      description: newDesc,
      icon: newIcon,
      color: '#66AB71',
      isMain: habits.length === 0,
    });
    setNewTitle('');
    setNewDesc('');
    setNewIcon('✨');
    setIsAddOpen(false);
  };

  const selectedHabit = habits.find(h => h.id === selectedHabitId);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center px-1">
        <h1 className="text-3xl font-serif italic text-foreground">{t('records.title')}</h1>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors paper-shadow"
        >
          +
        </button>
      </div>

      <motion.div layout className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {habits.map((habit) => (
            <motion.div
              key={habit.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              onClick={() => setSelectedHabitId(habit.id)}
              className={`
                bg-card border border-border rounded-[24px] p-6 space-y-4 paper-shadow 
                cursor-pointer transition-all hover:border-primary group
                ${habit.isMain ? 'ring-2 ring-primary/20 border-primary' : ''}
              `}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <span className="text-3xl bg-secondary w-12 h-12 flex items-center justify-center rounded-xl">{habit.icon}</span>
                  <div>
                    <h3 className="font-semibold text-foreground">{habit.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{habit.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!habit.isMain && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onSetMain(habit.id); }}
                      className="text-[10px] uppercase font-bold text-primary hover:underline"
                    >
                      {t('records.set-main')}
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(habit.id); }}
                    className="text-[10px] uppercase font-bold text-red-400 hover:underline"
                  >
                    {t('records.delete')}
                  </button>
                </div>
              </div>

              <div className="flex gap-1">
                {[...Array(14)].map((_, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() - (13 - i));
                  const ds = d.toISOString().split('T')[0];
                  const active = habit.logs.some(l => l.date === ds);
                  return (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${active ? 'bg-primary' : 'bg-secondary'}`}
                    />
                  );
                })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card w-full max-w-sm rounded-[28px] p-8 space-y-6 paper-shadow border border-border max-h-[85vh] overflow-y-auto custom-scroll"
            >
              <h2 className="text-2xl font-serif text-foreground italic text-center">{t('records.new-journey')}</h2>
              <form onSubmit={handleAdd} className="space-y-6">

                {/* Icon Selection Section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{t('records.icon')}</label>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground font-medium italic">{t('records.custom')}</span>
                      <input
                        maxLength={2}
                        value={newIcon}
                        onChange={e => setNewIcon(e.target.value)}
                        className="w-10 h-8 text-center bg-secondary border-none rounded-lg text-lg focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 bg-secondary/30 p-4 rounded-[20px] max-h-60 overflow-y-auto custom-scroll border border-border">
                    {EMOJI_CATEGORIES.map(cat => (
                      <div key={cat.name} className="space-y-2">
                        <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold opacity-70">{t(`categories.${cat.name}`)}</p>
                        <div className="grid grid-cols-7 gap-1">
                          {cat.icons.map(icon => (
                            <button
                              key={icon}
                              type="button"
                              onClick={() => setNewIcon(icon)}
                              className={`aspect-square rounded-lg flex items-center justify-center text-lg transition-all ${newIcon === icon ? 'bg-primary text-primary-foreground scale-110' : 'bg-card text-foreground hover:bg-border'}`}
                            >
                              {icon}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{t('records.journey-title')}</label>
                  <input
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full bg-secondary/50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-foreground"
                    placeholder={t('records.journey-title-placeholder')}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{t('records.journey-description')}</label>
                  <input
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    className="w-full bg-secondary/50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none text-foreground"
                    placeholder={t('records.journey-description-placeholder')}
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="flex-1 py-3 text-muted-foreground font-semibold text-sm uppercase tracking-wider"
                  >
                    {t('records.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm uppercase tracking-wider shadow-lg shadow-primary/20"
                  >
                    {t('records.create')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail/Calendar Modal */}
      <AnimatePresence>
        {selectedHabit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card w-full max-w-sm rounded-[28px] p-6 space-y-6 paper-shadow border border-border relative max-h-[90vh] overflow-y-auto custom-scroll"
            >
              <button
                onClick={() => setSelectedHabitId(null)}
                className="absolute top-6 right-6 text-muted-foreground hover:text-foreground z-10"
              >
                ✕
              </button>
              <div className="text-center space-y-2">
                <span className="text-4xl block">{selectedHabit.icon}</span>
                <h2 className="text-2xl font-serif text-foreground">{selectedHabit.title}</h2>
                <p className="text-sm text-muted-foreground italic px-4">{selectedHabit.description}</p>
              </div>

              <CalendarView
                logs={selectedHabit.logs}
                onToggle={(date, mood) => onToggleLog(selectedHabit.id, date, mood)}
                onUpdateMood={(date, mood) => onUpdateMood(selectedHabit.id, date, mood)}
              />

              <div className="pt-4 border-t border-border flex justify-between items-center">
                <div className="text-left">
                  <p className="text-[10px] uppercase text-muted-foreground tracking-widest font-bold">{t('records.journey-progress')}</p>
                  <p className="text-xl font-serif">{selectedHabit.logs.length} {t('records.total-check-ins')}</p>
                </div>
                <button
                  onClick={() => setSelectedHabitId(null)}
                  className="bg-secondary text-foreground px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-border transition-colors"
                >
                  {t('records.close')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Records;
