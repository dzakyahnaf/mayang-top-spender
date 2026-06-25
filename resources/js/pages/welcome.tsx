import PublicFooter from '@/components/public-footer';
import PublicNavbar from '@/components/public-navbar';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Gift, LogIn, RotateCcw, ShoppingBag, Trophy, X } from 'lucide-react';
import { useState } from 'react';

const rewardSteps = [
    { icon: LogIn, title: 'Daftar & Login', desc: 'Daftar sebagai member Mayang lalu login untuk ikut program Top Spender.' },
    { icon: ShoppingBag, title: 'Belanja & Kumpulkan', desc: 'Setiap belanjamu dicatat kasir dan diakumulasi jadi total belanjamu.' },
    { icon: Trophy, title: 'Naik Peringkat', desc: 'Semakin tinggi total belanja selama periode, semakin tinggi peringkatmu.' },
    { icon: RotateCcw, title: 'Perhatikan Refund', desc: 'Transaksi yang di-refund akan mengurangi total belanjamu pada periode ini.' },
];

export default function Welcome() {
    const [showHowTo, setShowHowTo] = useState(false);

    return (
        <>
            <Head title="Welcome" />
            <div className="from-mayang-50 to-mayang-100/40 selection:bg-mayang-500 relative min-h-screen overflow-x-hidden bg-gradient-to-br via-slate-50 font-sans text-slate-900 selection:text-white">
                <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-[600px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(circle_at_top,_rgba(27,174,185,0.08)_0%,_rgba(27,174,185,0)_70%)]" />

                <PublicNavbar current="" />

                {/* Hero */}
                <section className="relative z-10 flex min-h-screen items-center justify-center bg-transparent pt-32 pb-20 text-center">
                    <div className="relative z-10 mx-auto max-w-4xl px-4">
                        <div className="border-mayang-100 bg-mayang-50 text-mayang-700 mx-auto mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold">
                            <span className="relative flex size-2.5">
                                <span className="bg-mayang-400 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
                                <span className="bg-mayang-500 relative inline-flex size-2.5 rounded-full"></span>
                            </span>
                            Kompetisi Sedang Berlangsung
                        </div>
                        <h1 className="mb-8 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl">
                            Jadilah yang <span className="text-mayang-500">Teratas.</span>
                        </h1>
                        <p className="mx-auto mb-4 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
                            Di 27 tahun bersama Mayang, setiap transaksi selama periode program akan tercatat sebagai kesempatan meraih{' '}
                            <strong className="text-slate-900">hadiah Umroh</strong>. Cek posisimu dan ikuti perkembangannya langsung disini.
                        </p>
                        <p className="mx-auto mb-10 text-sm font-medium text-slate-400">1 Juli &ndash; 31 Desember 2026</p>
                        <div className="flex flex-col flex-wrap justify-center gap-4 sm:flex-row">
                            <Link
                                href={route('leaderboard')}
                                className="group bg-mayang-500 hover:bg-mayang-600 flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                Lihat Papan Peringkat
                                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                href={route('daftar-hadiah')}
                                className="group flex items-center justify-center gap-2 rounded-full border-2 border-amber-300 bg-amber-50 px-8 py-4 text-base font-bold text-amber-700 transition-all hover:-translate-y-0.5 hover:border-amber-400 hover:bg-amber-100"
                            >
                                <Gift className="size-5" />
                                Cek Hadiah
                            </Link>
                            <Link
                                href={route('register')}
                                className="flex items-center justify-center rounded-full border-2 border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
                            >
                                Daftar Sekarang
                            </Link>
                        </div>
                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={() => setShowHowTo(true)}
                                className="text-mayang-600 hover:text-mayang-700 text-sm font-semibold underline-offset-4 transition-colors hover:underline"
                            >
                                Cara meraih hadiahnya &rarr;
                            </button>
                        </div>
                    </div>
                </section>

                {/* How to Join */}
                <section className="to-mayang-50/60 relative z-10 border-t border-slate-100/60 bg-gradient-to-b from-transparent py-24">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Bergabung Sekarang</h2>
                            <p className="mt-4 text-lg text-slate-500">Hanya 4 langkah untuk menjadi bagian dari kompetisi ini.</p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {[
                                {
                                    step: '1',
                                    title: 'Daftarkan Dirimu',
                                    desc: (
                                        <>
                                            Daftar mandiri{' '}
                                            <a href={route('register')} className="text-mayang-600 font-semibold underline">
                                                di sini
                                            </a>{' '}
                                            atau di toko melalui kasir.
                                        </>
                                    ),
                                },
                                {
                                    step: '2',
                                    title: 'Belanja di Toko',
                                    desc: 'Belanja produk favoritmu di offline store Mayang di cabang manapun.',
                                },
                                {
                                    step: '3',
                                    title: 'Input Transaksi',
                                    desc: 'Info kasir nomor WA terdaftar untuk input total belanja.',
                                },
                                { step: '4', title: 'Pantau Peringkat', desc: 'Lihat peringkat di leaderboard.' },
                            ].map((item) => (
                                <div
                                    key={item.step}
                                    className="hover:shadow-mayang-500/5 rounded-2xl border border-slate-200 bg-white p-8 transition-shadow hover:shadow-lg"
                                >
                                    <div className="bg-mayang-50 text-mayang-500 mb-6 flex size-14 items-center justify-center rounded-xl text-2xl font-black">
                                        {item.step}
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold text-slate-900">{item.title}</h3>
                                    <p className="text-sm leading-relaxed text-slate-500">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <PublicFooter />
            </div>

            {/* Bottom Sheet: Cara meraih hadiahnya */}
            <div className={`fixed inset-0 z-[60] ${showHowTo ? '' : 'pointer-events-none'}`} aria-hidden={!showHowTo}>
                <div
                    onClick={() => setShowHowTo(false)}
                    className={`absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ${showHowTo ? 'opacity-100' : 'opacity-0'}`}
                />
                <div
                    className={`absolute right-0 bottom-0 left-0 mx-auto max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl transition-transform duration-300 ease-out sm:p-8 ${
                        showHowTo ? 'translate-y-0' : 'translate-y-full'
                    }`}
                >
                    <div className="mb-2 flex items-start justify-between">
                        <div>
                            <h3 className="text-2xl font-extrabold text-slate-900">Cara Meraih Hadiahnya</h3>
                            <p className="mt-1 text-sm text-slate-500">Ikuti langkah berikut untuk mengamankan hadiahmu.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowHowTo(false)}
                            className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
                        >
                            <X className="size-5" />
                        </button>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        {rewardSteps.map((step, index) => (
                            <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
                                <div className="bg-mayang-500/10 text-mayang-600 mb-4 flex size-11 items-center justify-center rounded-xl">
                                    <step.icon className="size-5" />
                                </div>
                                <div className="mb-1 text-xs font-bold text-slate-400">LANGKAH {index + 1}</div>
                                <h4 className="mb-1.5 font-bold text-slate-900">{step.title}</h4>
                                <p className="text-sm leading-relaxed text-slate-500">{step.desc}</p>
                            </div>
                        ))}
                    </div>

                    <Link
                        href={route('daftar-hadiah')}
                        className="bg-mayang-500 hover:bg-mayang-600 mt-6 flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-bold text-white shadow-md transition-all"
                    >
                        <Gift className="size-5" />
                        Lihat Daftar Hadiah
                    </Link>
                </div>
            </div>
        </>
    );
}
