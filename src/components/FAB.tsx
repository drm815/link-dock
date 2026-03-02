import { Plus } from "lucide-react";
import { useThemeContext } from "../contexts/ThemeContext";

interface FABProps {
    onClick: () => void;
}

export function FAB({ onClick }: FABProps) {
    const { mode } = useThemeContext();

    // Mode color classes
    const btnClass = mode === 'work' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-pink-500 hover:bg-pink-600';

    return (
        <button
            onClick={onClick}
            className={`fixed bottom-6 right-6 md:bottom-10 md:right-10 flex items-center justify-center min-w-[64px] min-h-[64px] rounded-full text-white shadow-lg shadow-black/20 transform transition-all hover:scale-105 active:scale-95 z-50 ${btnClass}`}
            aria-label="Add new link"
        >
            <Plus className="w-8 h-8" />
        </button>
    );
}
