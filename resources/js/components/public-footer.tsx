import { Link } from '@inertiajs/react';

const footerLinks = [
    { label: 'Leaderboard', route: 'leaderboard' },
    { label: 'Daftar Hadiah', route: 'daftar-hadiah' },
    { label: 'FAQ', route: 'faq' },
    { label: 'Syarat & Ketentuan', route: 'syarat' },
];

export default function PublicFooter() {
    return (
        <footer className="bg-mayang-900 relative z-10 mt-auto w-full text-white">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid gap-12 md:grid-cols-3">
                    <div>
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center bg-white/10 ring-1 ring-white/20">
                                <img src="/MayangCollection_Logo Icon_White.png" alt="Mayang Logo" className="size-6 object-contain" />
                            </div>
                            <span className="flex flex-col leading-none">
                                <span className="font-display text-lg font-bold tracking-wide">MAYANG</span>
                                <span className="text-mayang-300 text-[10px] font-bold tracking-[0.35em] uppercase">Top Spender</span>
                            </span>
                        </div>
                        <p className="max-w-xs text-sm leading-relaxed text-white/60">
                            Program loyalitas Mayang Modest Wear. Belanja, kumpulkan coin, dan raih hadiah utama Umrah.
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-5 text-xs font-bold tracking-[0.25em] text-white/50 uppercase">Navigasi</h4>
                        <ul className="space-y-3">
                            {footerLinks.map((link) => (
                                <li key={link.route}>
                                    <Link href={route(link.route)} className="hover:text-mayang-300 text-sm font-medium text-white/80 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-5 text-xs font-bold tracking-[0.25em] text-white/50 uppercase">Kunjungi Kami</h4>
                        <p className="text-sm leading-relaxed text-white/80">
                            Jl. Soekarno-Hatta No. 44-44A,
                            <br />
                            Mojolangu, Malang.
                        </p>
                        <p className="mt-4 text-sm leading-relaxed text-white/60">34 outlet tersebar di seluruh Jawa.</p>
                    </div>
                </div>

                <div className="mt-14 border-t border-white/10 pt-6 text-center">
                    <p className="text-xs tracking-wide text-white/45">
                        &copy; {new Date().getFullYear()} Mayang Modest Wear. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
