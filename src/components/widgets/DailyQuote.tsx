import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

interface Quote {
    content: string;
    author: string;
}

const fetchQuote = async (lang: string): Promise<Quote> => {
    const api = lang.startsWith('zh')
        ? 'https://v1.hitokoto.cn'
        : 'https://thequoteshub.com/api/';

    const res = await fetch(api);
    if (!res.ok) {
        throw new Error('Failed to fetch quote');
    }

    const data = await res.json();

    return {
        content: data.hitokoto || data.text,
        author: data.from || data.author,
    };
};

const DailyQuote: React.FC = () => {
    const { t, i18n } = useTranslation();

    const {
        data: quote,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['daily-quote', i18n.language],
        queryFn: () => fetchQuote(i18n.language),
        staleTime: 1000 * 60 * 60 * 24, // 24h 内视为新鲜（“每日一句”语义）
        retry: 1,
    });

    if (isLoading) {
        return (
            <section className="bg-card border border-border rounded-[28px] p-8 paper-shadow text-center flex flex-col items-center justify-center space-y-4 min-h-[140px]">
                <svg
                    className="animate-spin h-6 w-6 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium opacity-50">
                    {t('widgets.quote-loading')}
                </p>
            </section>
        );
    }

    if (isError || !quote) {
        return null;
    }

    return (
        <section className="bg-card border border-border rounded-[28px] p-8 paper-shadow text-center space-y-4">
            <p className="text-foreground font-serif italic text-lg leading-relaxed">
                “{quote.content}”
            </p>
            <div className="flex items-center justify-center gap-2">
                <div className="h-px w-4 bg-border" />
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                    {quote.author}
                </p>
                <div className="h-px w-4 bg-border" />
            </div>
        </section>
    );
};

export default DailyQuote;
