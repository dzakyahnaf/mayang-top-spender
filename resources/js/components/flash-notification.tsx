import { type SharedData } from '@/types';
import { router } from '@inertiajs/react';
import { CheckCircle2, X, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export function FlashNotification() {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        return router.on('success', (event) => {
            const flash = (event.detail.page.props as unknown as SharedData).flash;
            if (flash?.success) {
                setMessage({ type: 'success', text: flash.success });
                setVisible(true);
            } else if (flash?.error) {
                setMessage({ type: 'error', text: flash.error });
                setVisible(true);
            }
        });
    }, []);

    useEffect(() => {
        if (!visible) return;
        const timer = setTimeout(() => setVisible(false), 4000);
        return () => clearTimeout(timer);
    }, [visible]);

    if (!message) return null;

    const isSuccess = message.type === 'success';

    return (
        <div
            className={`fixed top-6 left-1/2 z-[100] w-full max-w-md -translate-x-1/2 px-4 transition-all duration-300 ${
                visible ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-4 opacity-0'
            }`}
            role="status"
            aria-live="polite"
        >
            <div
                className={`flex items-start gap-3 border bg-white px-5 py-4 shadow-2xl ${
                    isSuccess ? 'border-mayang-500' : 'border-rose-500'
                }`}
            >
                <div className={`mt-0.5 flex size-6 shrink-0 items-center justify-center ${isSuccess ? 'text-mayang-600' : 'text-rose-600'}`}>
                    {isSuccess ? <CheckCircle2 className="size-5" /> : <XCircle className="size-5" />}
                </div>
                <p className="flex-1 text-sm font-semibold text-slate-800">{message.text}</p>
                <button
                    type="button"
                    onClick={() => setVisible(false)}
                    className="text-slate-400 transition-colors hover:text-slate-700"
                    aria-label="Tutup notifikasi"
                >
                    <X className="size-4" />
                </button>
            </div>
        </div>
    );
}
