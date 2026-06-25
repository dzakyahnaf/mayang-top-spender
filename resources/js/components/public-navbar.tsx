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
        <nav className="fixed top-0 left-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-sm transition-all duration-300">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between gap-4">
                    <Link href="/" className="flex shrink-0 items-center gap-3 transition hover:opacity-80">
                        <div className="bg-mayang-500 flex size-10 items-center justify-center rounded-xl shadow-sm">
                            <img src="/MayangCollection_Logo Icon_White.png" alt="Mayang Logo" className="size-6 object-contain" />
                        </div>
                        <span className="hidden text-xl font-bold tracking-tight text-slate-900 sm:inline">
                            Mayang <span className="text-mayang-500 font-black">Top Spender</span>
                        </span>
                    </Link>

                    <div className="hidden items-center gap-6 md:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.route}
                                href={route(link.route)}
                                className={`text-sm font-semibold transition-colors ${
                                    current === link.route ? 'text-mayang-600' : 'hover:text-mayang-600 text-slate-600'
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
                                className="bg-mayang-500 hover:bg-mayang-600 rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('register')}
                                    className="bg-mayang-500 hover:bg-mayang-600 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all"
                                >
                                    Daftar Sekarang
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
                                >
                                    Masuk
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile links */}
                <div className="flex items-center gap-4 overflow-x-auto pb-3 md:hidden">
                    {navLinks.map((link) => (
                        <Link
                            key={link.route}
                            href={route(link.route)}
                            className={`text-xs font-semibold whitespace-nowrap transition-colors ${
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
