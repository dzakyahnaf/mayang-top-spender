import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { FormEventHandler, useState } from 'react';
import { Plus, Edit2, ShieldAlert, KeyRound, Trash2 } from 'lucide-react';

interface Cashier {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

interface Props {
    cashiers: Cashier[];
}

const formatDate = (date: string) => new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
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
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 rounded-2xl border border-mayang-100 bg-mayang-500/5 p-5 dark:border-mayang-900/30">
            <div className="flex items-center gap-2 text-mayang-600 dark:text-mayang-400">
                <KeyRound className="h-4.5 w-4.5" />
                <h4 className="text-sm font-bold">Reset Password Akun</h4>
            </div>
            <div className="space-y-2">
                <Label htmlFor={`password-${cashierId}`} className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password Baru</Label>
                <Input
                    id={`password-${cashierId}`}
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder="Masukkan password baru"
                    className="bg-white/50 focus-visible:ring-mayang-500/30 focus-visible:border-mayang-500 rounded-xl"
                />
                <InputError message={errors.password} />
            </div>
            <div className="space-y-2">
                <Label htmlFor={`password_confirmation-${cashierId}`} className="text-xs font-semibold text-slate-700 dark:text-slate-300">Konfirmasi Password</Label>
                <Input
                    id={`password_confirmation-${cashierId}`}
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    placeholder="Konfirmasi password baru"
                    className="bg-white/50 focus-visible:ring-mayang-500/30 focus-visible:border-mayang-500 rounded-xl"
                />
            </div>
            <div className="flex gap-2">
                <Button type="submit" size="sm" className="rounded-xl bg-mayang-600 text-white hover:bg-mayang-700 font-semibold" disabled={processing}>
                    {processing ? 'Menyimpan...' : 'Simpan Password'}
                </Button>
                <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={onClose}>
                    Batal
                </Button>
            </div>
        </form>
    );
}

export default function KasirIndex({ cashiers }: Props) {
    const { flash } = usePage<SharedData>().props;
    const [resetPasswordId, setResetPasswordId] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Kasir', href: '/admin/kasir' },
    ];

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus kasir ini?')) {
            router.delete(route('admin.kasir.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Kasir" />
            <div className="p-6 space-y-6 font-sans">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Kelola Kasir</h1>
                        <p className="text-sm text-slate-500 mt-1">Daftar akun kasir untuk melayani transaksi customer.</p>
                    </div>
                    <Button asChild className="rounded-xl bg-gradient-to-r from-mayang-500 to-mayang-600 text-white hover:from-mayang-600 hover:to-mayang-700 shadow-md shadow-mayang-500/20 font-bold self-start sm:self-auto">
                        <Link href={route('admin.kasir.create')} className="flex items-center gap-1.5">
                            <Plus className="h-4 w-4" />
                            Tambah Kasir
                        </Link>
                    </Button>
                </div>

                {flash?.success && (
                    <div className="rounded-2xl border border-mayang-100 bg-mayang-50/50 p-4 text-mayang-800 dark:text-mayang-300 dark:border-mayang-900/30 text-sm font-semibold">
                        {flash.success}
                    </div>
                )}

                <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white/50 shadow-xl dark:border-slate-800/50 dark:bg-slate-900/40 backdrop-blur-md">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-950/20 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/50">
                                    <th className="py-4 px-6">Nama Kasir</th>
                                    <th className="py-4 px-6">Email</th>
                                    <th className="py-4 px-6">Tanggal Dibuat</th>
                                    <th className="py-4 px-6 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {cashiers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-slate-500 dark:text-slate-400">
                                            Belum ada data kasir terdaftar.
                                        </td>
                                    </tr>
                                ) : (
                                    cashiers.map((cashier) => (
                                        <tr key={cashier.id} className="transition-colors hover:bg-mayang-500/5 dark:hover:bg-mayang-50/5 text-sm">
                                            <td className="py-4.5 px-6 font-bold text-slate-900 dark:text-white">{cashier.name}</td>
                                            <td className="py-4.5 px-6 text-slate-600 dark:text-slate-300">{cashier.email}</td>
                                            <td className="py-4.5 px-6 text-slate-500 dark:text-slate-400">{formatDate(cashier.created_at)}</td>
                                            <td className="py-4.5 px-6">
                                                <div className="flex flex-col items-end gap-2">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button variant="outline" size="sm" className="rounded-xl flex items-center gap-1" asChild>
                                                            <Link href={route('admin.kasir.edit', cashier.id)}>
                                                                <Edit2 className="h-3.5 w-3.5" />
                                                                Edit
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            className="rounded-xl flex items-center gap-1"
                                                            onClick={() =>
                                                                setResetPasswordId(
                                                                    resetPasswordId === cashier.id ? null : cashier.id,
                                                                )
                                                            }
                                                        >
                                                            <KeyRound className="h-3.5 w-3.5" />
                                                            Reset Password
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            className="rounded-xl flex items-center gap-1"
                                                            onClick={() => handleDelete(cashier.id)}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                            Hapus
                                                        </Button>
                                                    </div>
                                                    {resetPasswordId === cashier.id && (
                                                        <div className="w-full max-w-sm text-left">
                                                            <ResetPasswordForm
                                                                cashierId={cashier.id}
                                                                onClose={() => setResetPasswordId(null)}
                                                            />
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
