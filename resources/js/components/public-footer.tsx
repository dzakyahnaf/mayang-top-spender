import { Link } from '@inertiajs/react';

export default function PublicFooter() {
    return (
        <footer className="from-mayang-600 to-mayang-700 relative z-10 mt-auto w-full bg-gradient-to-br py-12 text-center text-sm text-white/70">
            <div className="mx-auto max-w-7xl px-4">
                <div className="mb-5 flex items-center justify-center gap-2.5">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                        <img src="/MayangCollection_Logo Icon_White.png" alt="Mayang Logo" className="size-5 object-contain" />
                    </div>
                    <span className="text-base font-bold tracking-tight text-white">
                        Mayang <span className="text-mayang-300 font-black">Top Spender</span>
                    </span>
                </div>
                <div className="mb-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                    <Link href={route('leaderboard')} className="hover:text-mayang-200 font-medium text-white/80 transition-colors">
                        Leaderboard
                    </Link>
                    <Link href={route('daftar-hadiah')} className="hover:text-mayang-200 font-medium text-white/80 transition-colors">
                        Daftar Hadiah
                    </Link>
                    <Link href={route('faq')} className="hover:text-mayang-200 font-medium text-white/80 transition-colors">
                        FAQ
                    </Link>
                    <Link href={route('syarat')} className="hover:text-mayang-200 font-medium text-white/80 transition-colors">
                        Syarat & Ketentuan
                    </Link>
                </div>
                <p>&copy; {new Date().getFullYear()} Mayang Modest Wear. All rights reserved.</p>
                <p className="mt-2 text-white/45">Jl. Soekarno-Hatta No. 44-44A, Mojolangu, Malang.</p>
            </div>
        </footer>
    );
}
