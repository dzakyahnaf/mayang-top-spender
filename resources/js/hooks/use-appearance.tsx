import { useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

const applyTheme = (appearance: Appearance) => {
    // The Mayang theme is designed around the light tosca palette. "System" is
    // intentionally decoupled from the OS so the dashboard never renders dark
    // unless the user explicitly opts in.
    const isDark = appearance === 'dark';

    document.documentElement.classList.toggle('dark', isDark);
};

export function initializeTheme() {
    const savedAppearance = (localStorage.getItem('appearance') as Appearance) || 'light';

    applyTheme(savedAppearance);
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>('light');

    const updateAppearance = (mode: Appearance) => {
        setAppearance(mode);
        localStorage.setItem('appearance', mode);
        applyTheme(mode);
    };

    useEffect(() => {
        const savedAppearance = localStorage.getItem('appearance') as Appearance | null;
        updateAppearance(savedAppearance || 'light');
    }, []);

    return { appearance, updateAppearance };
}
