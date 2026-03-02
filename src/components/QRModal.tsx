import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { X, Download } from 'lucide-react';

interface QRModalProps {
    url: string;
    title: string;
    onClose: () => void;
}

export function QRModal({ url, title, onClose }: QRModalProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, url, {
                width: 280,
                margin: 2,
                color: { dark: '#000000', light: '#ffffff' },
            });
        }
    }, [url]);

    const handleDownload = () => {
        if (!canvasRef.current) return;
        const a = document.createElement('a');
        a.href = canvasRef.current.toDataURL('image/png');
        a.download = `qr-${title}.png`;
        a.click();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-background border border-border rounded-2xl shadow-xl p-6 flex flex-col items-center gap-4 w-full max-w-xs"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex w-full items-center justify-between">
                    <p className="font-semibold text-sm truncate max-w-[220px]">{title}</p>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="bg-white p-3 rounded-xl shadow-inner">
                    <canvas ref={canvasRef} />
                </div>

                <p className="text-xs text-muted-foreground text-center truncate w-full px-2">{url}</p>

                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors w-full justify-center"
                >
                    <Download className="w-4 h-4" />
                    QR 이미지 저장
                </button>
            </div>
        </div>
    );
}
