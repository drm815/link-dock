import { useThemeContext } from '../contexts/ThemeContext';
import { Search } from 'lucide-react';
import { Input } from './ui/input';

interface HeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
    const { mode, setMode } = useThemeContext();

    return (
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4 md:px-8 transition-colors duration-300">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center justify-between md:w-auto">
                    <h1 className="text-2xl font-black tracking-tight" style={{ color: mode === 'work' ? '#4f46e5' : '#ec4899' }}>
                        LinkDock
                    </h1>

                    {/* Mobile mode toggles */}
                    <div className="flex md:hidden bg-muted rounded-full p-1">
                        <button
                            onClick={() => setMode('work')}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${mode === 'work'
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Work
                        </button>
                        <button
                            onClick={() => setMode('life')}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${mode === 'life'
                                    ? 'bg-pink-500 text-white shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Life
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="relative flex-1 max-w-md w-full ml-auto mr-auto md:ml-0 md:mr-0 order-last md:order-none">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search links..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 bg-background min-h-[44px] md:min-h-[40px] w-full rounded-xl"
                    />
                </div>

                {/* Desktop mode toggles */}
                <div className="hidden md:flex bg-muted rounded-full p-1">
                    <button
                        onClick={() => setMode('work')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === 'work'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Work
                    </button>
                    <button
                        onClick={() => setMode('life')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === 'life'
                                ? 'bg-pink-500 text-white shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Life
                    </button>
                </div>
            </div>
        </header>
    );
}
