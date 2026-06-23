import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-slate-50 font-sans selection:bg-mayang-500 selection:text-white">
                {/* Navbar (Glassmorphism) */}
                <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-md transition-all duration-300">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-20 items-center justify-between">
                            <Link href="/" className="text-2xl font-black tracking-tight text-mayang-600 transition hover:text-mayang-700">
                                Mayang
                                <span className="text-mayang-400"> Top Spender</span>
                            </Link>
                            <div className="flex items-center gap-6">
                                <Link href={route('leaderboard')} className="text-sm font-semibold text-slate-600 transition-colors hover:text-mayang-600">
                                    Leaderboard
                                </Link>
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-full bg-gradient-to-r from-mayang-500 to-mayang-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-mayang-500/30 transition-all hover:-translate-y-0.5 hover:shadow-mayang-500/50"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('login')}
                                        className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl"
                                    >
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-mayang-50 via-white to-mayang-100 pb-20 pt-32 text-center">
                    {/* Decorative Elements */}
                    <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-mayang-200/50 blur-3xl filter"></div>
                    <div className="absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-mayang-300/30 blur-3xl filter"></div>

                    <div className="relative z-10 mx-auto max-w-4xl px-4">
                        <div className="mb-6 inline-flex animate-bounce items-center gap-2 rounded-full border border-mayang-200 bg-white/50 px-4 py-2 text-sm font-semibold text-mayang-700 shadow-sm backdrop-blur-sm">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mayang-400 opacity-75"></span>
                              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-mayang-500"></span>
                            </span>
                            Kompetisi Sedang Berlangsung!
                        </div>
                        <h1 className="mb-6 text-6xl font-extrabold tracking-tight text-slate-900 md:text-7xl">
                            Jadilah yang <span className="bg-gradient-to-r from-mayang-500 to-mayang-400 bg-clip-text text-transparent">Teratas.</span>
                        </h1>
                        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
                            Belanja koleksi terbaru di Mayang Modest Wear, tingkatkan transaksimu, dan rebut posisi pertama di Top Spender Leaderboard untuk memenangkan hadiah eksklusif!
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Link
                                href={route('leaderboard')}
                                className="group flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-mayang-500 to-mayang-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-mayang-500/30 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-mayang-500/40"
                            >
                                Lihat Leaderboard
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </Link>
                            <Link
                                href={route('register')}
                                className="flex items-center justify-center rounded-full border-2 border-mayang-200 bg-white/50 px-8 py-4 text-base font-bold text-mayang-700 shadow-sm backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                            >
                                Daftar Sekarang
                            </Link>
                        </div>
                    </div>
                </section>

                {/* How to Join */}
                <section className="relative z-20 -mt-10 bg-white py-24 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)] sm:rounded-t-[3rem]">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Cara Ikutan Sangat Mudah</h2>
                            <p className="mt-4 text-lg text-slate-500">Hanya 4 langkah untuk menjadi bagian dari kompetisi ini.</p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {[
                                { step: '1', title: 'Daftar Member', desc: 'Daftar mandiri di website atau langsung di toko melalui kasir.' },
                                { step: '2', title: 'Belanja', desc: 'Pilih dan belanja produk Modest Wear favoritmu.' },
                                { step: '3', title: 'Input Transaksi', desc: 'Kasir akan mencatat nominal belanjamu ke sistem.' },
                                { step: '4', title: 'Pantau Peringkat', desc: 'Lihat peringkatmu naik di Leaderboard publik!' },
                            ].map((item) => (
                                <div key={item.step} className="group relative rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-mayang-500/10 hover:border-mayang-100">
                                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-mayang-50 to-mayang-100 text-2xl font-black text-mayang-600 transition-transform duration-300 group-hover:scale-110 group-hover:from-mayang-500 group-hover:to-mayang-600 group-hover:text-white">
                                        {item.step}
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold text-slate-900">{item.title}</h3>
                                    <p className="text-sm leading-relaxed text-slate-500">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <footer className="bg-slate-900 py-12 text-center text-sm text-slate-400">
                    <div className="mx-auto max-w-7xl px-4">
                        <p>&copy; 2026 Mayang Modest Wear. All rights reserved.</p>
                        <p className="mt-2 text-slate-500">Jl. Soekarno-Hatta No. 44-44A, Mojolangu, Malang.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
