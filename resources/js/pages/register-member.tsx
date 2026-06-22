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

            <div className="min-h-screen bg-gray-50">
                {/* Navbar */}
                <nav className="bg-white shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <Link href="/" className="text-xl font-bold text-pink-600">Mayang Top Spender</Link>
                            <div className="flex items-center gap-4">
                                <Link href={route('leaderboard')} className="text-sm text-gray-600 hover:text-gray-900">Leaderboard</Link>
                                <Link href={route('my-spending')} className="text-sm text-gray-600 hover:text-gray-900">Cek Belanjaanku</Link>
                                <Link href={route('customer.register')} className="text-sm text-gray-600 hover:text-gray-900">Daftar Member</Link>
                                {auth.user ? (
                                    <Link href={route('dashboard')} className="rounded-md bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700">
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link href={route('login')} className="rounded-md bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700">
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Content */}
                <div className="mx-auto max-w-lg px-4 py-12 sm:px-6 lg:px-8">
                    <h1 className="text-center text-3xl font-bold text-gray-900">Daftar Member</h1>
                    <p className="mt-2 text-center text-gray-600">Daftarkan dirimu sebagai member Mayang Modest Wear</p>

                    {flash?.success && (
                        <div className="mt-6 rounded-md bg-green-50 p-4">
                            <p className="text-sm font-medium text-green-800">{flash.success}</p>
                        </div>
                    )}

                    <form onSubmit={submit} className="mt-8 rounded-lg bg-white p-6 shadow-md">
                        <div className="space-y-6">
                            {/* Nama Lengkap */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Nama Lengkap
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                                    placeholder="Masukkan nama lengkap"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                                    placeholder="Masukkan email"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            {/* Nomor HP */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                    Nomor HP
                                </label>
                                <input
                                    id="phone"
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                                    placeholder="Masukkan nomor HP"
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-md bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {processing ? 'Mendaftar...' : 'Daftar Member'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <footer className="bg-gray-800 py-8 text-center text-sm text-gray-400">
                    &copy; 2026 Mayang Modest Wear
                </footer>
            </div>
        </>
    );
}
