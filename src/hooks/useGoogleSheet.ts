import { useState, useEffect, useCallback } from 'react';
import type { LinkItem } from '../types';

const SCRIPT_URL_KEY = 'linkdock_script_url';

export function useGoogleSheet() {
    const [links, setLinks] = useState<LinkItem[]>([]);
    const [scriptUrl, setScriptUrl] = useState<string>(() =>
        localStorage.getItem(SCRIPT_URL_KEY) ?? ''
    );
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isConfigured = scriptUrl.trim() !== '';

    const fetchLinks = useCallback(async () => {
        if (!isConfigured) return;
        setSyncing(true);
        setError(null);
        try {
            const res = await fetch(`${scriptUrl}?action=get`);
            const data: LinkItem[] = await res.json();
            setLinks(data);
        } catch {
            setError('구글 시트에서 데이터를 불러오지 못했습니다.');
        } finally {
            setSyncing(false);
        }
    }, [scriptUrl, isConfigured]);

    useEffect(() => {
        fetchLinks();
    }, [fetchLinks]);

    const addLink = useCallback(async (link: LinkItem) => {
        // 낙관적 업데이트
        setLinks((prev) => [link, ...prev]);
        try {
            await fetch(scriptUrl, {
                method: 'POST',
                body: JSON.stringify({ action: 'add', link }),
            });
        } catch {
            setError('링크 추가에 실패했습니다.');
            setLinks((prev) => prev.filter((l) => l.id !== link.id));
        }
    }, [scriptUrl]);

    const deleteLink = useCallback(async (id: string) => {
        const prev = links;
        // 낙관적 업데이트
        setLinks((l) => l.filter((item) => item.id !== id));
        try {
            await fetch(scriptUrl, {
                method: 'POST',
                body: JSON.stringify({ action: 'delete', id }),
            });
        } catch {
            setError('링크 삭제에 실패했습니다.');
            setLinks(prev);
        }
    }, [scriptUrl, links]);

    const saveScriptUrl = useCallback((url: string) => {
        const trimmed = url.trim();
        localStorage.setItem(SCRIPT_URL_KEY, trimmed);
        setScriptUrl(trimmed);
        setError(null);
    }, []);

    return {
        links,
        syncing,
        error,
        isConfigured,
        scriptUrl,
        saveScriptUrl,
        addLink,
        deleteLink,
        refetch: fetchLinks,
    };
}
