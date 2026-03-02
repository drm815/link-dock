import React, { useState, useRef, useCallback } from 'react';
import type { LinkItem } from '../types';
import { Card } from './ui/card';
import { ExternalLink, Trash2, QrCode } from 'lucide-react';
import { QRModal } from './QRModal';

interface LinkCardProps {
    link: LinkItem;
    onDelete: (id: string) => void;
    primaryColor: string;
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
            onLoad={(e) => {
                const img = e.currentTarget;
                if (img.naturalWidth <= 16 && img.naturalHeight <= 16) {
                    setFailed(true);
                }
            }}
        />
    );
}

export function LinkCard({ link, onDelete, primaryColor }: LinkCardProps) {
    const [showQR, setShowQR] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [pressing, setPressing] = useState(false);
    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const didLongPress = useRef(false);

    const startLongPress = useCallback(() => {
        didLongPress.current = false;
        setPressing(true);
        longPressTimer.current = setTimeout(() => {
            didLongPress.current = true;
            setPressing(false);
            setShowDeleteConfirm(true);
        }, 600);
    }, []);

    const cancelLongPress = useCallback(() => {
        if (longPressTimer.current) clearTimeout(longPressTimer.current);
        setPressing(false);
    }, []);

    const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        if (didLongPress.current) {
            e.preventDefault();
        }
    }, []);

    return (
        <>
            {showQR && <QRModal url={link.url} title={link.title} onClose={() => setShowQR(false)} />}

            {/* 삭제 확인 모달 */}
            {showDeleteConfirm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={() => setShowDeleteConfirm(false)}
                >
                    <div
                        className="bg-background border border-border rounded-2xl shadow-xl p-6 w-full max-w-xs flex flex-col gap-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col gap-1">
                            <p className="font-semibold">링크를 삭제할까요?</p>
                            <p className="text-sm text-muted-foreground truncate">{link.title}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    onDelete(link.id);
                                }}
                                className="flex-1 px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center gap-1.5"
                            >
                                <Trash2 className="w-4 h-4" />
                                삭제
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Card
                className={`group relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 bg-card border-border min-h-[80px] sm:min-h-[100px] flex items-center p-3 sm:p-5 rounded-2xl select-none ${pressing ? 'scale-95 brightness-90' : ''}`}
                onMouseDown={startLongPress}
                onMouseUp={cancelLongPress}
                onMouseLeave={cancelLongPress}
                onTouchStart={startLongPress}
                onTouchEnd={cancelLongPress}
                onTouchCancel={cancelLongPress}
                onContextMenu={(e) => e.preventDefault()}
            >
                <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center gap-4 min-w-0"
                    onClick={handleClick}
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

                {/* QR 버튼 */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowQR(true);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    className="p-2 sm:p-2.5 text-muted-foreground hover:text-primary hover:bg-muted rounded-full transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="QR 코드 보기"
                >
                    <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Active Mode indicator bar */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: primaryColor }}
                />
            </Card>
        </>
    );
}
