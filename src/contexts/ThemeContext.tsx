import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Category } from '../types';

interface ThemeContextType {
    mode: Category;
    setMode: (mode: Category) => void;
    toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<Category>('work');

    const toggleMode = () => {
        setMode((prev) => (prev === 'work' ? 'life' : 'work'));
    };

    return (
        <ThemeContext.Provider value={{ mode, setMode, toggleMode }}>
            {/* We can also attach a class to the body/html based on mode if needed for theming */}
            <div className={`theme-${mode} min-h-screen bg-background text-foreground transition-colors duration-300`}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useThemeContext() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
}
