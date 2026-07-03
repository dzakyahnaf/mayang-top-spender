import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

const navLinks = [
    { label: 'Leaderboard', route: 'leaderboard' },
    { label: 'Daftar Hadiah', route: 'daftar-hadiah' },
    { label: 'FAQ', route: 'faq' },
    { label: 'Syarat & Ketentuan', route: 'syarat' },
];

export default function PublicNavbar({ current }: { current?: string }) {
    const { auth } = usePage<SharedData>().props;

    return (
        <nav className="fixed top-0 left-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between gap-4">
                    <Link href="/" className="flex shrink-0 items-center gap-3 transition hover:opacity-80">
                        <div className="bg-mayang-500 flex size-10 items-center justify-center">
                            <img src="/MayangCollection_Logo Icon_White.png" alt="Mayang Logo" className="size-6 object-contain" />
                        </div>
                        <span className="hidden flex-col leading-none sm:flex">
                            <span className="font-display text-lg font-bold tracking-wide text-slate-900">MAYANG</span>
                            <span className="text-mayang-600 text-[10px] font-bold tracking-[0.35em] uppercase">Top Spender</span>
                        </span>
                    </Link>

                    <div className="hidden items-center gap-8 md:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.route}
                                href={route(link.route)}
                                className={`border-b-2 pb-1 text-xs font-bold tracking-[0.15em] uppercase transition-colors ${
                                    current === link.route
                                        ? 'border-mayang-500 text-mayang-600'
                                        : 'hover:text-mayang-600 border-transparent text-slate-600'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="bg-mayang-500 hover:bg-mayang-600 px-6 py-2.5 text-xs font-bold tracking-[0.15em] text-white uppercase transition-all"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('register')}
                                    className="bg-mayang-500 hover:bg-mayang-600 px-5 py-2.5 text-xs font-bold tracking-[0.15em] text-white uppercase transition-all"
                                >
                                    Daftar
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="hover:border-mayang-500 hover:text-mayang-600 border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold tracking-[0.15em] text-slate-700 uppercase transition-all"
                                >
                                    Masuk
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile links */}
                <div className="flex items-center gap-5 overflow-x-auto pb-3 md:hidden">
                    {navLinks.map((link) => (
                        <Link
                            key={link.route}
                            href={route(link.route)}
                            className={`text-[11px] font-bold tracking-[0.15em] whitespace-nowrap uppercase transition-colors ${
                                current === link.route ? 'text-mayang-600' : 'hover:text-mayang-600 text-slate-500'
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
