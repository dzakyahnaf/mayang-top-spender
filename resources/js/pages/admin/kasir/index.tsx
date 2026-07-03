import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Edit2, KeyRound, Plus, Trash2 } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Cashier {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

interface Props {
    cashiers: Cashier[];
}

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

function ResetPasswordForm({ cashierId, onClose }: { cashierId: number; onClose: () => void }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        password: '',
        password_confirmation: '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.kasir.reset-password', cashierId), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-4 space-y-4 border border-slate-200 bg-white/95 p-5 shadow-lg dark:border-zinc-800/80 dark:bg-zinc-950/80"
        >
            <div className="text-mayang-600 dark:text-mayang-400 flex items-center gap-2">
                <KeyRound className="h-4.5 w-4.5" />
                <h4 className="text-sm font-bold">Reset Password Akun</h4>
            </div>
            <div className="space-y-2">
                <Label htmlFor={`password-${cashierId}`} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password Baru
                </Label>
                <Input
                    id={`password-${cashierId}`}
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder="Masukkan password baru"
                    className="focus-visible:ring-mayang-500/20 focus-visible:border-mayang-500 border-slate-200 bg-white/60 py-4.5 transition-all duration-300 focus-visible:ring-4 dark:border-zinc-800/80 dark:bg-zinc-900/40"
                />
                <InputError message={errors.password} />
            </div>
            <div className="space-y-2">
                <Label htmlFor={`password_confirmation-${cashierId}`} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Konfirmasi Password
                </Label>
                <Input
                    id={`password_confirmation-${cashierId}`}
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    placeholder="Konfirmasi password baru"
                    className="focus-visible:ring-mayang-500/20 focus-visible:border-mayang-500 border-slate-200 bg-white/60 py-4.5 transition-all duration-300 focus-visible:ring-4 dark:border-zinc-800/80 dark:bg-zinc-900/40"
                />
            </div>
            <div className="flex gap-2 pt-1.5">
                <Button
                    type="submit"
                    size="sm"
                    className="from-mayang-500 to-mayang-600 hover:from-mayang-600 hover:to-mayang-700 shadow-mayang-500/20 bg-gradient-to-r font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                    disabled={processing}
                >
                    {processing ? 'Menyimpan...' : 'Simpan Password'}
                </Button>
                <Button type="button" variant="outline" size="sm" className="dark:border-zinc-850 border-slate-200" onClick={onClose}>
                    Batal
                </Button>
            </div>
        </form>
    );
}

export default function KasirIndex({ cashiers }: Props) {
    const [resetPasswordId, setResetPasswordId] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Kasir', href: '/admin/kasir' }];

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus kasir ini?')) {
            router.delete(route('admin.kasir.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Kasir" />
            <div className="space-y-6 p-6 font-sans">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Kelola Kasir</h1>
                        <p className="mt-1 text-sm text-slate-500">Daftar akun kasir untuk melayani transaksi customer.</p>
                    </div>
                    <Button
                        asChild
                        className="from-mayang-500 to-mayang-600 hover:from-mayang-600 hover:to-mayang-700 shadow-mayang-500/20 hover:shadow-mayang-500/30 w-full bg-gradient-to-r px-5 py-5 font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 sm:w-auto"
                    >
                        <Link href={route('admin.kasir.create')} className="flex items-center gap-1.5">
                            <Plus className="h-4 w-4" />
                            Tambah Kasir
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden border border-slate-200/50 bg-white/70 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="bg-mayang-50/70 text-mayang-700 border-b border-slate-200/30 text-xs font-bold tracking-wider uppercase dark:border-zinc-800/50 dark:bg-zinc-950/40 dark:text-zinc-400">
                                    <th className="px-6 py-4">Nama Kasir</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Tanggal Dibuat</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200/30 dark:divide-zinc-800/50">
                                {cashiers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center font-medium text-slate-500 dark:text-zinc-400">
                                            Belum ada data kasir terdaftar.
                                        </td>
                                    </tr>
                                ) : (
                                    cashiers.map((cashier) => (
                                        <tr
                                            key={cashier.id}
                                            className="hover:bg-mayang-500/5 dark:hover:bg-mayang-500/10 text-sm transition-all duration-200"
                                        >
                                            <td className="px-6 py-4.5 font-bold text-slate-900 dark:text-white">{cashier.name}</td>
                                            <td className="dark:text-zinc-350 px-6 py-4.5 text-slate-600">{cashier.email}</td>
                                            <td className="px-6 py-4.5 text-slate-500 dark:text-zinc-400">{formatDate(cashier.created_at)}</td>
                                            <td className="px-6 py-4.5">
                                                <div className="flex flex-col items-end gap-2">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex items-center gap-1 border-slate-200 transition-colors hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
                                                            asChild
                                                        >
                                                            <Link href={route('admin.kasir.edit', cashier.id)}>
                                                                <Edit2 className="h-3.5 w-3.5" />
                                                                Edit
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            className="bg-mayang-500/10 text-mayang-600 hover:bg-mayang-500/20 dark:bg-mayang-500/20 dark:text-mayang-400 border-mayang-500/20 flex items-center gap-1 border transition-all duration-200"
                                                            onClick={() => setResetPasswordId(resetPasswordId === cashier.id ? null : cashier.id)}
                                                        >
                                                            <KeyRound className="h-3.5 w-3.5" />
                                                            Reset Password
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="flex items-center gap-1 border border-rose-500/20 bg-rose-500/10 text-rose-600 transition-all duration-200 hover:bg-rose-500/20 hover:text-rose-700"
                                                            onClick={() => handleDelete(cashier.id)}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                            Hapus
                                                        </Button>
                                                    </div>
                                                    {resetPasswordId === cashier.id && (
                                                        <div className="w-full max-w-sm text-left">
                                                            <ResetPasswordForm cashierId={cashier.id} onClose={() => setResetPasswordId(null)} />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
