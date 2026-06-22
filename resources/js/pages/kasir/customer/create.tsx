import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Daftarkan Customer', href: '/kasir/customer/create' },
];

export default function CreateCustomer() {
    const { flash } = usePage<any>().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post(route('kasir.customer.store'), { onSuccess: () => reset() });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftarkan Customer Baru" />
            <div className="mx-auto max-w-2xl p-6">
                <h1 className="mb-6 text-2xl font-bold">Daftarkan Customer Baru</h1>

                {flash?.success && (
                    <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-700">{flash.success}</div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Nama Lengkap</label>
                        <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-pink-500 focus:ring-pink-500" />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Email</label>
                        <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-pink-500 focus:ring-pink-500" />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium">Nomor HP</label>
                        <input type="text" value={data.phone} onChange={(e) => setData('phone', e.target.value)}
                            placeholder="08xxxxxxxxxx"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-pink-500 focus:ring-pink-500" />
                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>
                    <button type="submit" disabled={processing} className="w-full rounded-lg bg-pink-600 px-4 py-2 text-white hover:bg-pink-700 disabled:opacity-50">
                        {processing ? 'Menyimpan...' : 'Daftarkan Customer'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
