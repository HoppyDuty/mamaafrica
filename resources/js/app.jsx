import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { CurrencyProvider } from './Contexts/CurrencyContext';
import { LanguageProvider } from './Contexts/LanguageContext';

const appName = import.meta.env.VITE_APP_NAME || 'Mama Africa';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    // Eager-load every page into the initial bundle so navigating between
    // pages never waits on a network round-trip for a new JS chunk.
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx', { eager: true })),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <LanguageProvider>
                <CurrencyProvider>
                    <App {...props} />
                </CurrencyProvider>
            </LanguageProvider>
        );
    },
    // No top-of-page progress bar; navigation is prefetched/instant already.
    progress: false,
});
