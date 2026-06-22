import { type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface MySpendingProps {
    customer?: {
        name: string;
        email: string;
        phone: string;
    };
    transactions?: Array<{
        id: number;
        amount: number;
        created_at: string;
        period: {
            name: string;
        };
    }>;
    totalSpending?: number;
    error?: string;
}

function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID').format(amount);
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export default function MySpending({ customer, transactions, totalSpending, error }: MySpendingProps) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, post, processing } = useForm({
        phone: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('my-spending.search'));
    };

    return (
        <>
            <Head title="Cek Belanjaanku" />

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
                <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                    <h1 className="text-center text-3xl font-bold text-gray-900">Cek Belanjaanku</h1>
                    <p className="mt-2 text-center text-gray-600">Masukkan nomor HP untuk melihat riwayat belanjamu</p>

                    {/* Search Form */}
                    <form onSubmit={submit} className="mx-auto mt-8 max-w-md">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                                placeholder="Masukkan nomor HP"
                            />
                            <button
                                type="submit"
                                disabled={processing}
                                className="whitespace-nowrap rounded-md bg-pink-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {processing ? 'Mencari...' : 'Cek Belanja'}
                            </button>
                        </div>
                    </form>

                    {/* Error Message */}
                    {error && (
                        <div className="mx-auto mt-6 max-w-md rounded-md bg-red-50 p-4">
                            <p className="text-sm font-medium text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Customer Info & Transactions */}
                    {customer && (
                        <div className="mt-8 space-y-6">
                            {/* Customer Card */}
                            <div className="rounded-lg bg-white p-6 shadow-md">
                                <h2 className="text-lg font-semibold text-gray-900">Informasi Member</h2>
                                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div>
                                        <p className="text-sm text-gray-500">Nama</p>
                                        <p className="font-medium text-gray-900">{customer.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium text-gray-900">{customer.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Nomor HP</p>
                                        <p className="font-medium text-gray-900">{customer.phone}</p>
                                    </div>
                                </div>
                                <div className="mt-4 border-t border-gray-200 pt-4">
                                    <p className="text-sm text-gray-500">Total Belanja</p>
                                    <p className="text-2xl font-bold text-pink-600">
                                        Rp {formatRupiah(totalSpending ?? 0)}
                                    </p>
                                </div>
                            </div>

                            {/* Transaction History */}
                            {transactions && transactions.length > 0 && (
                                <div className="overflow-hidden rounded-lg bg-white shadow-md">
                                    <div className="px-6 py-4">
                                        <h2 className="text-lg font-semibold text-gray-900">Riwayat Belanja</h2>
                                    </div>
                                    <table className="w-full">
                                        <thead className="bg-pink-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pink-600">
                                                    Tanggal
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-pink-600">
                                                    Nominal
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-pink-600">
                                                    Periode
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {transactions.map((transaction) => (
                                                <tr key={transaction.id} className="hover:bg-gray-50">
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                        {formatDate(transaction.created_at)}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-gray-900">
                                                        Rp {formatRupiah(transaction.amount)}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                        {transaction.period.name}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <footer className="bg-gray-800 py-8 text-center text-sm text-gray-400">
                    &copy; 2026 Mayang Modest Wear
                </footer>
            </div>
        </>
    );
}
