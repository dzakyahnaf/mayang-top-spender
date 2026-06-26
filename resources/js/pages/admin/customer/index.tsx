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
                            Total belanja ditampilkan untuk kompetisi aktif:{' '}
                            <strong className="text-mayang-600 dark:text-mayang-400">{period.name}</strong>
                        </p>
                    )}
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-200/50 bg-white/70 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-mayang-50/70 text-mayang-700 border-b border-slate-200/30 text-xs font-bold tracking-wider uppercase dark:border-zinc-800/50 dark:bg-zinc-950/40 dark:text-zinc-400">
                                    <th className="px-6 py-4">Nama</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Nomor HP</th>
                                    <th className="px-6 py-4">Tanggal Daftar</th>
                                    {period && <th className="px-6 py-4 text-right">Total Belanja</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/30 dark:divide-zinc-800/50">
                                {customers.data.map((c) => (
                                    <tr key={c.id} className="hover:bg-mayang-500/5 dark:hover:bg-mayang-500/10 text-sm transition-all duration-200">
                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{c.name}</td>
                                        <td className="dark:text-zinc-350 px-6 py-4 text-slate-600">{c.email}</td>
                                        <td className="dark:text-zinc-350 px-6 py-4 text-slate-600">{c.phone}</td>
                                        <td className="px-6 py-4 font-medium text-slate-500 dark:text-zinc-400">
                                            {new Date(c.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        {period && (
                                            <td className="text-mayang-600 dark:text-mayang-400 px-6 py-4 text-right font-black">
                                                {formatRupiah(c.total_spending || 0)}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                {customers.data.length === 0 && (
                                    <tr>
                                        <td colSpan={period ? 5 : 4} className="py-12 text-center font-medium text-slate-500 dark:text-zinc-400">
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
                                className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                                    link.active
                                        ? 'from-mayang-500 to-mayang-600 border-mayang-500 shadow-mayang-500/20 bg-gradient-to-r text-white shadow-md'
                                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:bg-zinc-800/50'
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
