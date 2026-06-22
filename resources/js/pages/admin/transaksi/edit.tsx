import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Props {
    transaction: {
        id: number;
        amount: number;
        notes: string | null;
        customer: { name: string };
        period: { name: string };
    };
}

export default function EditTransaction({ transaction }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Transaksi', href: '/admin/transaksi' },
        { title: 'Edit', href: '#' },
    ];

    const { data, setData, put, processing, errors } = useForm({
        amount: String(transaction.amount),
        notes: transaction.notes || '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        put(route('admin.transaksi.update', transaction.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Transaksi" />
            <div className="mx-auto max-w-2xl p-6">
                <h1 className="mb-6 text-2xl font-bold">Edit Transaksi</h1>

                <div className="mb-6 rounded-lg bg-gray-50 p-4 text-sm">
                    <p><strong>Customer:</strong> {transaction.customer.name}</p>
                    <p><strong>Periode:</strong> {transaction.period.name}</p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Nominal Belanja (Rp)</label>
                        <input type="number" value={data.amount} onChange={(e) => setData('amount', e.target.value)} min="1"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-pink-500 focus:ring-pink-500" />
                        {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Catatan</label>
                        <textarea value={data.notes} onChange={(e) => setData('notes', e.target.value)} rows={2}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-pink-500 focus:ring-pink-500" />
                    </div>
                    <button type="submit" disabled={processing} className="w-full rounded-lg bg-pink-600 px-4 py-2 text-white hover:bg-pink-700 disabled:opacity-50">
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
