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
            <div className="p-6 font-sans">
                <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Daftar Customer</h1>
                    {period && (
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Total belanja ditampilkan untuk kompetisi aktif: <strong className="text-mayang-600 dark:text-mayang-400">{period.name}</strong>
                        </p>
                    )}
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white/50 shadow-xl dark:border-slate-800/50 dark:bg-slate-900/40 backdrop-blur-md">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-950/20 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/50">
                                    <th className="py-4 px-6">Nama</th>
                                    <th className="py-4 px-6">Email</th>
                                    <th className="py-4 px-6">Nomor HP</th>
                                    <th className="py-4 px-6">Tanggal Daftar</th>
                                    {period && <th className="py-4 px-6 text-right">Total Belanja</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {customers.data.map((c) => (
                                    <tr key={c.id} className="transition-colors hover:bg-mayang-500/5 dark:hover:bg-mayang-50/5 text-sm">
                                        <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{c.name}</td>
                                        <td className="py-4 px-6 text-slate-600 dark:text-slate-300">{c.email}</td>
                                        <td className="py-4 px-6 text-slate-600 dark:text-slate-300">{c.phone}</td>
                                        <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                                            {new Date(c.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        {period && (
                                            <td className="py-4 px-6 text-right font-black text-mayang-600 dark:text-mayang-400">
                                                {formatRupiah(c.total_spending || 0)}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                {customers.data.length === 0 && (
                                    <tr>
                                        <td colSpan={period ? 5 : 4} className="py-12 text-center text-slate-500 dark:text-slate-400">
                                            Belum ada customer terdaftar.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {customers.links.length > 3 && (
                    <div className="mt-6 flex justify-center gap-1.5">
                        {customers.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all border ${
                                    link.active
                                        ? 'bg-gradient-to-r from-mayang-500 to-mayang-600 border-mayang-500 text-white shadow-md shadow-mayang-500/20'
                                        : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50 dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
                                } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
