import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';

interface AuthLayoutProps {
    children: React.ReactNode;
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-900 font-sans p-6 md:p-10 selection:bg-mayang-500 selection:text-white">
            {/* Background decorative blobs */}
            <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-mayang-700/20 blur-3xl filter animate-pulse duration-[6000ms]"></div>
            <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-mayang-600/20 blur-3xl filter animate-pulse duration-[8000ms]"></div>

            <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium group">
                            <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-mayang-500 to-mayang-400 text-white shadow-lg transition-transform group-hover:scale-105">
                                <AppLogoIcon className="size-8 fill-current" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-white">
                                Mayang<span className="text-mayang-400"> Modest</span>
                            </span>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl font-extrabold tracking-tight text-white">{title}</h1>
                            <p className="text-sm text-slate-400">{description}</p>
                        </div>
                    </div>
                    
                    {/* Render children inside auth wrapper */}
                    <div className="text-white">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
