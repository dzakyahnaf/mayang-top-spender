import { Link } from '@inertiajs/react';

interface AuthLayoutProps {
    children: React.ReactNode;
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="selection:bg-mayang-500 from-mayang-50 to-mayang-100/40 relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br via-slate-50 p-6 font-sans text-slate-900 selection:text-white md:p-10">
            {/* Spotlight Glow */}
            <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-[600px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(circle_at_top,_rgba(27,174,185,0.08)_0%,_rgba(27,174,185,0)_70%)]" />

            <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <Link href="/" className="group flex flex-col items-center gap-3 transition hover:opacity-80">
                            <div className="bg-mayang-500 flex size-14 items-center justify-center rounded-xl shadow-sm transition-transform group-hover:scale-105">
                                <img src="/MayangCollection_Logo Icon_White.png" alt="Mayang Logo" className="size-8 object-contain" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900">
                                Mayang <span className="text-mayang-500 font-black">Modest</span>
                            </span>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{title}</h1>
                            <p className="text-sm text-slate-500">{description}</p>
                        </div>
                    </div>

                    {/* Render children inside auth wrapper */}
                    <div className="text-slate-900">{children}</div>
                </div>
            </div>
        </div>
    );
}
