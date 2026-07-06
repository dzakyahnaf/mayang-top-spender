import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Staff {
    id: number;
    name: string;
}

interface Props {
    cashier: { id: number; name: string };
    staff: Staff[];
}

export default function CashierStaffIndex({ cashier, staff }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Kasir', href: '/admin/kasir' },
        { title: `Staff ${cashier.name}`, href: '#' },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({ name: '' });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.kasir.staff.store', cashier.id), {
            onSuccess: () => reset(),
        });
    };

    const handleDelete = (staffId: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus staff ini?')) {
            router.delete(route('admin.kasir.staff.destroy', [cashier.id, staffId]));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Staff ${cashier.name}`} />
            <div className="w-full space-y-6 p-6 font-sans">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Kelola Staff</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Daftar nama staff untuk akun kasir <strong className="text-slate-900 dark:text-white">{cashier.name}</strong>.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        className="flex items-center gap-1.5 border-slate-200 transition-colors hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
                        asChild
                    >
                        <Link href={route('admin.kasir.index')}>
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden border border-slate-200/50 bg-white/70 p-6 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60">
                    <form onSubmit={handleSubmit} className="flex max-w-lg items-start gap-3">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Nama Staff Baru
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Nama lengkap staff"
                                className="focus-visible:ring-mayang-500/20 focus-visible:border-mayang-500 border-slate-200 bg-white/60 py-5.5 transition-all duration-300 focus-visible:ring-4 dark:border-zinc-800/80 dark:bg-zinc-950/40"
                            />
                            <InputError message={errors.name} />
                        </div>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="from-mayang-500 to-mayang-600 hover:from-mayang-600 hover:to-mayang-700 mt-7 flex items-center gap-1.5 bg-gradient-to-r font-bold text-white"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah
                        </Button>
                    </form>
                </div>

                <div className="overflow-hidden border border-slate-200/50 bg-white/70 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-mayang-50/70 text-mayang-700 border-b border-slate-200/30 text-xs font-bold tracking-wider uppercase dark:border-zinc-800/50 dark:bg-zinc-950/40 dark:text-zinc-400">
                                <th className="px-6 py-4">Nama Staff</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/30 dark:divide-zinc-800/50">
                            {staff.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="py-12 text-center font-medium text-slate-500 dark:text-zinc-400">
                                        Belum ada staff terdaftar untuk kasir ini.
                                    </td>
                                </tr>
                            ) : (
                                staff.map((s) => (
                                    <tr key={s.id} className="hover:bg-mayang-500/5 dark:hover:bg-mayang-500/10 text-sm transition-all duration-200">
                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{s.name}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="flex items-center gap-1 border border-rose-500/20 bg-rose-500/10 text-rose-600 transition-all duration-200 hover:bg-rose-500/20 hover:text-rose-700"
                                                onClick={() => handleDelete(s.id)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                Hapus
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
