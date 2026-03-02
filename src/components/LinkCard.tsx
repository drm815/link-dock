import React, { useState } from 'react';
import type { LinkItem } from '../types';
import { Card } from './ui/card';
import { ExternalLink, Trash2 } from 'lucide-react';

interface LinkCardProps {
    link: LinkItem;
    onDelete: (id: string) => void;
    primaryColor: string; // Tailwind hex color for accents based on mode
}

// 도메인에서 일관된 색상을 생성하는 함수
function getDomainColor(domain: string): string {
    const colors = [
        '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71',
        '#1abc9c', '#3498db', '#9b59b6', '#e91e63',
        '#00bcd4', '#ff5722', '#607d8b', '#795548',
    ];
    let hash = 0;
    for (let i = 0; i < domain.length; i++) {
        hash = domain.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

function FaviconWithFallback({ url, title }: { url: string; title: string }) {
    const [failed, setFailed] = useState(false);

    let domain = '';
    try {
        domain = new URL(url).hostname.replace('www.', '');
    } catch {
        domain = title;
    }

    const initial = (domain[0] ?? title[0] ?? '?').toUpperCase();
    const bgColor = getDomainColor(domain);
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${url}&sz=64`;

    if (failed) {
        return (
            <div
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base select-none"
                style={{ backgroundColor: bgColor }}
            >
                {initial}
            </div>
        );
    }

    return (
        <img
            src={faviconUrl}
            alt="favicon"
            className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
            onError={() => setFailed(true)}
        />
    );
}

export function LinkCard({ link, onDelete, primaryColor }: LinkCardProps) {
    return (
        <Card className="group relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 bg-card border-border min-h-[80px] sm:min-h-[100px] flex items-center p-3 sm:p-5 rounded-2xl">
            <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center gap-4 min-w-0"
            >
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-xl flex items-center justify-center overflow-hidden">
                    <FaviconWithFallback url={link.url} title={link.title} />
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg truncate group-hover:text-primary transition-colors" style={{ '--tw-text-opacity': 1, color: `var(--hover-color)` } as React.CSSProperties}>
                        {link.title}
                    </h3>
                </div>

                <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-muted/50 text-muted-foreground group-hover:bg-primary/10 transition-colors mr-2" style={{ color: primaryColor }}>
                    <ExternalLink className="w-4 h-4" />
                </div>
            </a>

            {/* Delete button appears on hover in Desktop, but always available on Mobile via some interaction, or we make it visible but subtle */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(link.id);
                }}
                className="p-2 sm:p-2.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Delete link"
            >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Active Mode indicator bar */}
            <div
                className="absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: primaryColor }}
            />
        </Card>
    );
}
