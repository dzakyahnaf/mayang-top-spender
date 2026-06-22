import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    created_at: string;
    total_spending?: number;
}

interface Props {
    customers: {
        data: Customer[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    period: { name: string } | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Customer', href: '/admin/customer' },
];

const formatRupiah = (val: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(val);

export default function CustomerIndex({ customers, period }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Customer" />
            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">Daftar Customer</h1>

                {period && (
                    <p className="mb-4 text-sm text-gray-500">Total belanja ditampilkan untuk periode: <strong>{period.name}</strong></p>
                )}

                <div className="overflow-hidden rounded-lg border">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Nama</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">HP</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Tanggal Daftar</th>
                                {period && <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Total Belanja</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {customers.data.map((c) => (
                                <tr key={c.id}>
                                    <td className="px-6 py-4 text-sm font-medium">{c.name}</td>
                                    <td className="px-6 py-4 text-sm">{c.email}</td>
                                    <td className="px-6 py-4 text-sm">{c.phone}</td>
                                    <td className="px-6 py-4 text-sm">{new Date(c.created_at).toLocaleDateString('id-ID')}</td>
                                    {period && <td className="px-6 py-4 text-sm">{formatRupiah(c.total_spending || 0)}</td>}
                                </tr>
                            ))}
                            {customers.data.length === 0 && (
                                <tr><td colSpan={period ? 5 : 4} className="px-6 py-8 text-center text-gray-500">Belum ada customer terdaftar.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {customers.links.length > 3 && (
                    <div className="mt-4 flex gap-1">
                        {customers.links.map((link, i) => (
                            <Link key={i} href={link.url || '#'}
                                className={`rounded px-3 py-1 text-sm ${link.active ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
