import { Link } from '@inertiajs/react';

export default function PublicFooter() {
    return (
        <footer className="relative z-10 mt-auto w-full border-t border-slate-200 bg-white py-12 text-center text-sm text-slate-500">
            <div className="mx-auto max-w-7xl px-4">
                <div className="mb-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                    <Link href={route('leaderboard')} className="hover:text-mayang-600 font-medium transition-colors">
                        Leaderboard
                    </Link>
                    <Link href={route('daftar-hadiah')} className="hover:text-mayang-600 font-medium transition-colors">
                        Daftar Hadiah
                    </Link>
                    <Link href={route('faq')} className="hover:text-mayang-600 font-medium transition-colors">
                        FAQ
                    </Link>
                    <Link href={route('syarat')} className="hover:text-mayang-600 font-medium transition-colors">
                        Syarat & Ketentuan
                    </Link>
                </div>
                <p>&copy; {new Date().getFullYear()} Mayang Modest Wear. All rights reserved.</p>
                <p className="mt-2">Jl. Soekarno-Hatta No. 44-44A, Mojolangu, Malang.</p>
            </div>
        </footer>
    );
}
