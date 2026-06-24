import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome" />
            <div className="relative min-h-screen bg-gradient-to-br from-mayang-50 via-slate-50 to-mayang-100/40 font-sans text-slate-900 selection:bg-mayang-500 selection:text-white overflow-x-hidden">
                {/* Spotlight Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_top,_rgba(27,174,185,0.08)_0%,_rgba(27,174,185,0)_70%)] pointer-events-none z-0" />

                {/* Clean Navbar */}
                <nav className="fixed top-0 left-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-sm transition-all duration-300">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-20 items-center justify-between">
                            <Link href="/" className="flex items-center gap-3 transition hover:opacity-80">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-mayang-500 shadow-sm">
                                    <img src="/MayangCollection_Logo Icon_White.png" alt="Mayang Logo" className="size-6 object-contain" />
                                </div>
                                <span className="text-xl font-bold tracking-tight text-slate-900">
                                    Mayang <span className="text-mayang-500 font-black">Top Spender</span>
                                </span>
                            </Link>
                            <div className="flex items-center gap-6">
                                <Link
                                    href={route('leaderboard')}
                                    className="text-sm font-semibold text-slate-600 transition-colors hover:text-mayang-600"
                                >
                                    Leaderboard
                                </Link>
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-full bg-mayang-500 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-mayang-600"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('login')}
                                        className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-800"
                                    >
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Clean Hero Section */}
                <section className="relative flex min-h-screen items-center justify-center bg-transparent pt-32 pb-20 text-center z-10">
                    <div className="relative z-10 mx-auto max-w-4xl px-4">
                        <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-mayang-100 bg-mayang-50 px-4 py-2 text-sm font-semibold text-mayang-700">
                            <span className="relative flex size-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mayang-400 opacity-75"></span>
                                <span className="relative inline-flex size-2.5 rounded-full bg-mayang-500"></span>
                            </span>
                            Kompetisi Sedang Berlangsung
                        </div>
                        <h1 className="mb-8 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl">
                            Jadilah yang <span className="text-mayang-500">Teratas.</span>
                        </h1>
                        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
                            Belanja koleksi terbaru di Mayang Modest Wear, tingkatkan transaksimu, dan rebut posisi pertama di Top Spender Leaderboard untuk memenangkan hadiah eksklusif.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Link
                                href={route('leaderboard')}
                                className="group flex items-center justify-center gap-2 rounded-full bg-mayang-500 px-8 py-4 text-base font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-mayang-600 hover:shadow-lg"
                            >
                                Lihat Leaderboard
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-5 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </Link>
                            <Link
                                href={route('register')}
                                className="flex items-center justify-center rounded-full border-2 border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
                            >
                                Daftar Sekarang
                            </Link>
                        </div>
                    </div>
                </section>

                {/* How to Join - Clean Grid */}
                <section className="relative border-t border-slate-200/60 bg-gradient-to-b from-transparent to-mayang-50/20 py-24 z-10">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-16 text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Cara Ikutan Sangat Mudah</h2>
                            <p className="mt-4 text-lg text-slate-500">Hanya 4 langkah untuk menjadi bagian dari kompetisi ini.</p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {[
                                { step: '1', title: 'Daftar Member', desc: 'Daftar mandiri di website atau langsung di toko melalui kasir.' },
                                { step: '2', title: 'Belanja', desc: 'Pilih dan belanja produk Modest Wear favoritmu.' },
                                { step: '3', title: 'Input Transaksi', desc: 'Kasir akan mencatat nominal belanjamu ke sistem.' },
                                { step: '4', title: 'Pantau Peringkat', desc: 'Lihat peringkatmu naik di Leaderboard publik!' },
                            ].map((item) => (
                                <div key={item.step} className="rounded-2xl border border-slate-200 bg-white p-8 transition-shadow hover:shadow-lg hover:shadow-mayang-500/5">
                                    <div className="mb-6 flex size-14 items-center justify-center rounded-xl bg-mayang-50 text-2xl font-black text-mayang-500">
                                        {item.step}
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold text-slate-900">{item.title}</h3>
                                    <p className="text-sm leading-relaxed text-slate-500">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <footer className="relative border-t border-slate-200 bg-white py-12 text-center text-sm text-slate-500 z-10">
                    <div className="mx-auto max-w-7xl px-4">
                        <p>&copy; {new Date().getFullYear()} Mayang Modest Wear. All rights reserved.</p>
                        <p className="mt-2">Jl. Soekarno-Hatta No. 44-44A, Mojolangu, Malang.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
