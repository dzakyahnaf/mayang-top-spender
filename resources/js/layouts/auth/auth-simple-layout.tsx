import { Link } from '@inertiajs/react';

interface AuthLayoutProps {
    children: React.ReactNode;
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="selection:bg-mayang-500 min-h-screen bg-slate-50 font-sans text-slate-900 selection:text-white flex flex-col justify-center items-center p-6 md:p-10">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <Link href="/" className="group flex flex-col items-center gap-3 transition hover:opacity-80">
                            <div className="flex size-14 items-center justify-center rounded-xl bg-mayang-500 shadow-sm transition-transform group-hover:scale-105">
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
