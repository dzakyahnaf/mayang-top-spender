import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';
import { FlashNotification } from './components/flash-notification';
import { initializeTheme } from './hooks/use-appearance';

declare global {
    const route: typeof routeFn;
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <FlashNotification />
                <App {...props} />
            </>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();

// After a new deploy, the browser may still hold references to old, now-deleted
// JS chunk URLs. Force a one-time reload instead of leaving the user on a blank page.
window.addEventListener('vite:preloadError', () => {
    if (!sessionStorage.getItem('vite-reloaded')) {
        sessionStorage.setItem('vite-reloaded', '1');
        window.location.reload();
    }
});
