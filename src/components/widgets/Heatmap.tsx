import React from 'react';
import { Habit } from '@/types';
import { useTranslation } from 'react-i18next';
import { getSafeLanguage } from '@/utils/locale';

interface HeatmapProps {
    habits: Habit[];
}

const Heatmap: React.FC<HeatmapProps> = ({ habits }) => {
    const { t, i18n } = useTranslation();
    return (
        <section className="bg-card border border-border rounded-[28px] p-6 paper-shadow space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-bold px-1">{t('widgets.heatmap-title')}</h3>
                <span className="text-[10px] text-primary/70 font-medium">{t('widgets.heatmap-subtitle')}</span>
            </div>
            <div className="grid grid-flow-col grid-rows-7 gap-1.5 h-32">
                {Array.from({ length: 30 }).map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (29 - i));
                    const formattedDate = new Intl.DateTimeFormat(getSafeLanguage(i18n.language), {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                    }).format(date);

                    const dateStr = date.toISOString().split('T')[0]; // Keep for comparison with habit logs

                    const loggedCount = habits.reduce((acc, h) => acc + (h.logs.some(l => l.date === dateStr) ? 1 : 0), 0);
                    const totalCount = habits.length;
                    const ratio = totalCount > 0 ? loggedCount / totalCount : 0;

                    let colorClass = 'bg-secondary/50';
                    if (ratio > 0.75) colorClass = 'bg-primary';
                    else if (ratio > 0.4) colorClass = 'bg-primary/70';
                    else if (ratio > 0) colorClass = 'bg-primary/30';

                    return (
                        <div
                            key={i}
                            className={`w-full h-full rounded-sm ${colorClass} transition-colors duration-500`}
                            title={`${formattedDate}: ${loggedCount}/${totalCount}`}
                        />
                    );
                })}
            </div>
        </section>
    );
};

export default Heatmap;
