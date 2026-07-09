import PublicFooter from '@/components/public-footer';
import PublicNavbar from '@/components/public-navbar';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Gift, LogIn, RotateCcw, ShoppingBag, Trophy, X } from 'lucide-react';
import { useState } from 'react';

const HERO_IMG = '/MAYANG-bg-1.webp';
const GALLERY_IMGS = [
    { src: '/hadiah-emas.webp', alt: 'Hadiah Emas Mayang Top Spender' },
    { src: '/hadiah-umroh.webp', alt: 'Hadiah Umrah Mayang Top Spender' },
    { src: '/hadiah-panci.webp', alt: 'Hadiah Paket Alat Dapur Mayang Top Spender' },
];

const rewardSteps = [
    { icon: LogIn, title: 'Daftar & Login', desc: 'Daftar sebagai member Mayang lalu login untuk ikut program Top Spender.' },
    { icon: ShoppingBag, title: 'Belanja & Kumpulkan', desc: 'Setiap belanjamu dicatat kasir dan diakumulasi jadi total belanjamu.' },
    { icon: Trophy, title: 'Naik Peringkat', desc: 'Semakin tinggi total belanja selama periode, semakin tinggi peringkatmu.' },
    { icon: RotateCcw, title: 'Perhatikan Refund', desc: 'Transaksi yang di-refund akan mengurangi total belanjamu pada periode ini.' },
];

const joinSteps = [
    { step: '01', title: 'Daftarkan Dirimu', desc: 'Daftar mandiri lewat website atau di toko melalui kasir.' },
    { step: '02', title: 'Belanja di Toko', desc: 'Belanja produk favoritmu di offline store Mayang di cabang manapun.' },
    { step: '03', title: 'Input Transaksi', desc: 'Info kasir nomor WA terdaftar untuk input total belanja.' },
    { step: '04', title: 'Pantau Peringkat', desc: 'Lihat posisimu di leaderboard dan pertahankan sampai akhir periode.' },
];

export default function Welcome() {
    const [showHowTo, setShowHowTo] = useState(false);

    return (
        <>
            <Head title="Welcome" />
            <div className="selection:bg-mayang-500 relative min-h-screen overflow-x-hidden bg-white font-sans text-slate-900 selection:text-white">
                <PublicNavbar current="" />

                {/* Hero banner, full-width dengan teks di tengah */}
                <section className="relative z-10 h-[85vh] min-h-[600px] w-full overflow-hidden pt-20">
                    <img src={HERO_IMG} alt="Mayang Modest Wear" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-slate-950/50" aria-hidden="true" />

                    <div className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-4 text-center text-white sm:px-6">
                        <p className="mb-4 text-xs font-bold tracking-[0.3em] text-white/70 uppercase">Mayang - Top Spender</p>
                        <h1 className="font-display mb-8 text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl lg:text-7xl">
                            Jadilah yang <span className="text-mayang-300 italic">Teratas.</span>
                        </h1>
                        <p className="mb-4 max-w-2xl text-lg leading-relaxed text-white/85">
                            Di 27 tahun bersama Mayang, setiap transaksi selama periode program akan tercatat sebagai kesempatan meraih{' '}
                            <strong className="text-white">Paket Umrah</strong>. Cek posisimu dan ikuti perkembangannya langsung disini.
                        </p>
                        <p className="mb-10 text-sm font-bold tracking-[0.2em] text-white/60 uppercase">1 Juli &ndash; 31 Desember 2026</p>

                        <div className="flex flex-col flex-wrap justify-center gap-4 sm:flex-row">
                            <Link
                                href={route('leaderboard')}
                                className="group bg-mayang-500 hover:bg-mayang-600 flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold tracking-[0.15em] text-white uppercase transition-all"
                            >
                                Papan Peringkat
                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                href={route('register')}
                                className="flex items-center justify-center border border-white/40 bg-white/10 px-8 py-4 text-sm font-bold tracking-[0.15em] text-white uppercase backdrop-blur-sm transition-all hover:border-white hover:bg-white/20"
                            >
                                Daftar Sekarang
                            </Link>
                        </div>
                        <div className="mt-8">
                            <button
                                type="button"
                                onClick={() => setShowHowTo(true)}
                                className="text-mayang-200 hover:text-mayang-100 text-sm font-semibold underline-offset-4 transition-colors hover:underline"
                            >
                                Cara meraih hadiahnya &rarr;
                            </button>
                        </div>
                    </div>
                </section>

                {/* Strip statistik */}
                <section className="border-y border-slate-200 bg-slate-50">
                    <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                        {[
                            { value: '27', label: 'Tahun Bersama Mayang' },
                            { value: '34', label: 'Outlet se-Jawa' },
                            { value: 'Umrah', label: 'Hadiah Utama Periode Ini' },
                        ].map((stat) => (
                            <div key={stat.label} className="px-8 py-10 text-center">
                                <p className="font-display text-4xl font-bold text-slate-900">{stat.value}</p>
                                <p className="mt-2 text-xs font-bold tracking-[0.25em] text-slate-400 uppercase">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* How to Join */}
                <section className="relative z-10 bg-white py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 max-w-2xl">
                            <p className="mb-3 text-xs font-bold tracking-[0.3em] text-slate-400 uppercase">Cara Bergabung</p>
                            <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Bergabung Sekarang</h2>
                            <p className="mt-4 text-lg text-slate-500">Hanya 4 langkah untuk menjadi bagian dari kompetisi ini.</p>
                        </div>
                        <div className="grid gap-px border border-slate-200 bg-slate-200 md:grid-cols-2 lg:grid-cols-4">
                            {joinSteps.map((item) => (
                                <div key={item.step} className="group bg-white p-8 transition-colors hover:bg-slate-50">
                                    <p className="font-display text-mayang-500 mb-6 text-5xl font-bold">{item.step}</p>
                                    <h3 className="mb-3 text-lg font-bold text-slate-900">{item.title}</h3>
                                    <p className="text-sm leading-relaxed text-slate-500">
                                        {item.step === '01' ? (
                                            <>
                                                Daftar mandiri{' '}
                                                <a href={route('register')} className="text-mayang-600 font-semibold underline">
                                                    di sini
                                                </a>{' '}
                                                atau di toko melalui kasir.
                                            </>
                                        ) : (
                                            item.desc
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Galeri */}
                <section className="border-t border-slate-200 bg-white py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
                            <div>
                                <p className="mb-3 text-xs font-bold tracking-[0.3em] text-slate-400 uppercase">Mayang Modest Wear</p>
                                <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                                    Belanja Elegan, <span className="text-mayang-500 italic">Berbuah Berkah.</span>
                                </h2>
                            </div>
                            <Link
                                href={route('daftar-hadiah')}
                                className="hover:text-mayang-600 group flex items-center gap-2 text-sm font-bold tracking-[0.15em] text-slate-700 uppercase transition-colors"
                            >
                                Lihat Semua Hadiah
                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-3">
                            {GALLERY_IMGS.map((img) => (
                                <div key={img.src} className="group overflow-hidden">
                                    <img
                                        src={img.src}
                                        alt={img.alt}
                                        className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
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
                    className={`absolute right-0 bottom-0 left-0 mx-auto max-h-[85vh] w-full max-w-2xl overflow-y-auto border-t-2 border-slate-900 bg-white p-6 shadow-2xl transition-transform duration-300 ease-out sm:p-8 ${
                        showHowTo ? 'translate-y-0' : 'translate-y-full'
                    }`}
                >
                    <div className="mb-2 flex items-start justify-between">
                        <div>
                            <h3 className="font-display text-3xl font-bold text-slate-900">Cara Meraih Hadiahnya</h3>
                            <p className="mt-1 text-sm text-slate-500">Ikuti langkah berikut untuk mengamankan hadiahmu.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowHowTo(false)}
                            className="flex size-9 items-center justify-center border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100"
                        >
                            <X className="size-5" />
                        </button>
                    </div>

                    <div className="mt-6 grid gap-px border border-slate-200 bg-slate-200 sm:grid-cols-2">
                        {rewardSteps.map((step, index) => (
                            <div key={index} className="bg-white p-5">
                                <div className="bg-mayang-500/10 text-mayang-600 mb-4 flex size-11 items-center justify-center">
                                    <step.icon className="size-5" />
                                </div>
                                <div className="mb-1 text-[10px] font-bold tracking-[0.25em] text-slate-400 uppercase">Langkah {index + 1}</div>
                                <h4 className="mb-1.5 font-bold text-slate-900">{step.title}</h4>
                                <p className="text-sm leading-relaxed text-slate-500">{step.desc}</p>
                            </div>
                        ))}
                    </div>

                    <Link
                        href={route('daftar-hadiah')}
                        className="bg-mayang-500 hover:bg-mayang-600 mt-6 flex w-full items-center justify-center gap-2 px-8 py-4 text-sm font-bold tracking-[0.15em] text-white uppercase transition-all"
                    >
                        <Gift className="size-4" />
                        Lihat Daftar Hadiah
                    </Link>
                </div>
            </div>
        </>
    );
}
