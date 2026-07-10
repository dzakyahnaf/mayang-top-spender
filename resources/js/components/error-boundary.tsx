import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

/**
 * Without this, an uncaught render error anywhere in the tree (e.g. a stale
 * Ziggy route lookup after a deploy) unmounts the whole app and leaves a
 * blank white page with no way to recover except a manual refresh.
 */
export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('Unhandled render error:', error, errorInfo);

        if (!sessionStorage.getItem('render-error-reloaded')) {
            sessionStorage.setItem('render-error-reloaded', '1');
            window.location.reload();
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white p-6 text-center font-sans dark:bg-zinc-950">
                    <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">Halaman mengalami kendala saat memuat.</p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="from-mayang-500 to-mayang-600 rounded-md bg-gradient-to-r px-6 py-3 font-bold text-white shadow-md"
                    >
                        Muat Ulang Halaman
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
