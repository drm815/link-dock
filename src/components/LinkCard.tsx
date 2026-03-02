import React from 'react';
import type { LinkItem } from '../types';
import { Card } from './ui/card';
import { ExternalLink, Trash2 } from 'lucide-react';

interface LinkCardProps {
    link: LinkItem;
    onDelete: (id: string) => void;
    primaryColor: string; // Tailwind hex color for accents based on mode
}

export function LinkCard({ link, onDelete, primaryColor }: LinkCardProps) {
    // Simple fallback favicon grabber from google s2
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${link.url}&sz=64`;

    return (
        <Card className="group relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 bg-card border-border min-h-[80px] sm:min-h-[100px] flex items-center p-3 sm:p-5 rounded-2xl">
            <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center gap-4 min-w-0"
            >
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-xl flex items-center justify-center overflow-hidden">
                    <img
                        src={faviconUrl}
                        alt="favicon"
                        className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                        onError={(e) => {
                            // Fallback to generic icon
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.parentElement) {
                                e.currentTarget.parentElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
                            }
                        }}
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg truncate group-hover:text-primary transition-colors" style={{ '--tw-text-opacity': 1, color: `var(--hover-color)` } as React.CSSProperties}>
                        {link.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate opacity-80 mt-0.5">
                        {link.url}
                    </p>
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
