import { type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function RegisterMember() {
    const { auth } = usePage<SharedData>().props;
    const { flash } = usePage<SharedData & { flash?: { success?: string } }>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('customer.register.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <Head title="Daftar Member" />

            <div className="from-mayang-50 to-mayang-100/40 selection:bg-mayang-500 relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-gradient-to-br via-slate-50 font-sans text-slate-900 selection:text-white">
                {/* Spotlight Glow */}
                <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-[600px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(circle_at_top,_rgba(27,174,185,0.08)_0%,_rgba(27,174,185,0)_70%)]" />
                {/* Clean Navbar */}
                <nav className="fixed top-0 left-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-sm transition-all duration-300">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-20 items-center justify-between">
                            <Link href="/" className="flex items-center gap-3 transition hover:opacity-80">
                                <div className="bg-mayang-500 flex size-10 items-center justify-center rounded-xl shadow-sm">
                                    <img src="/MayangCollection_Logo Icon_White.png" alt="Mayang Logo" className="size-6 object-contain" />
                                </div>
                                <span className="text-xl font-bold tracking-tight text-slate-900">
                                    Mayang <span className="text-mayang-500 font-black">Top Spender</span>
                                </span>
                            </Link>
                            <div className="flex items-center gap-6">
                                <Link
                                    href={route('leaderboard')}
                                    className="hover:text-mayang-600 text-sm font-semibold text-slate-600 transition-colors"
                                >
                                    Leaderboard
                                </Link>
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="bg-mayang-500 hover:bg-mayang-600 rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all"
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

                {/* Content */}
                <div className="relative z-10 flex min-h-screen w-full flex-1 items-center justify-center px-4 pt-32 pb-20 sm:px-6 lg:px-8">
                    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
                        <div className="mb-8 text-center">
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Daftar Member</h1>
                            <p className="mt-2 text-sm text-slate-500">Bergabunglah untuk mulai memenangkan kompetisi Top Spender.</p>
                        </div>

                        {flash?.success && (
                            <div className="border-mayang-200 bg-mayang-50 mb-6 flex items-center gap-3 rounded-xl border p-4">
                                <div className="bg-mayang-500 flex size-8 shrink-0 items-center justify-center rounded-full text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <p className="text-mayang-800 text-sm font-semibold">{flash.success}</p>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            {/* Nama Lengkap */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-bold text-slate-700">
                                    Nama Lengkap
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="focus:border-mayang-500 focus:ring-mayang-500/10 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm transition-all outline-none focus:ring-4"
                                        placeholder="Cth: Nisa Sabyan"
                                    />
                                </div>
                                {errors.name && <p className="mt-1.5 text-sm font-medium text-red-500">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-slate-700">
                                    Alamat Email
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="focus:border-mayang-500 focus:ring-mayang-500/10 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm transition-all outline-none focus:ring-4"
                                        placeholder="Cth: nisa@example.com"
                                    />
                                </div>
                                {errors.email && <p className="mt-1.5 text-sm font-medium text-red-500">{errors.email}</p>}
                            </div>

                            {/* Nomor HP */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-bold text-slate-700">
                                    Nomor Handphone (WhatsApp)
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="phone"
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="focus:border-mayang-500 focus:ring-mayang-500/10 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm transition-all outline-none focus:ring-4"
                                        placeholder="Cth: 081234567890"
                                    />
                                </div>
                                {errors.phone && <p className="mt-1.5 text-sm font-medium text-red-500">{errors.phone}</p>}
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="group bg-mayang-500 hover:bg-mayang-600 focus:ring-mayang-500 flex w-full justify-center rounded-xl px-4 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:shadow-md focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-70 disabled:hover:shadow-sm"
                                >
                                    {processing ? (
                                        <span className="flex items-center gap-2">
                                            <svg
                                                className="size-5 animate-spin text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Memproses...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Daftar Sekarang
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="size-4 transition-transform group-hover:translate-x-1"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <footer className="relative z-10 mt-auto w-full border-t border-slate-200 bg-white py-12 text-center text-sm text-slate-500">
                    <div className="mx-auto max-w-7xl px-4">
                        <p>&copy; {new Date().getFullYear()} Mayang Modest Wear. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
