import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
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

const formatDate = (date: string) => new Date(date).toLocaleDateString('id-ID');

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
        <form onSubmit={handleSubmit} className="mt-2 space-y-3 rounded-lg border bg-muted/30 p-4">
            <div className="space-y-2">
                <Label htmlFor={`password-${cashierId}`}>Password Baru</Label>
                <Input
                    id={`password-${cashierId}`}
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder="Masukkan password baru"
                />
                <InputError message={errors.password} />
            </div>
            <div className="space-y-2">
                <Label htmlFor={`password_confirmation-${cashierId}`}>Konfirmasi Password</Label>
                <Input
                    id={`password_confirmation-${cashierId}`}
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    placeholder="Konfirmasi password baru"
                />
            </div>
            <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={processing}>
                    {processing ? 'Menyimpan...' : 'Simpan'}
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={onClose}>
                    Batal
                </Button>
            </div>
        </form>
    );
}

export default function KasirIndex({ cashiers }: Props) {
    const { flash } = usePage<any>().props;
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
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Kelola Kasir</h1>
                    <Button asChild>
                        <Link href={route('admin.kasir.create')}>Tambah Kasir</Link>
                    </Button>
                </div>

                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 p-4 text-green-800 dark:text-green-200 text-sm">
                        {flash.success}
                    </div>
                )}

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="text-left py-3 px-4 font-semibold">Nama</th>
                                <th className="text-left py-3 px-4 font-semibold">Email</th>
                                <th className="text-left py-3 px-4 font-semibold">Tanggal Dibuat</th>
                                <th className="text-left py-3 px-4 font-semibold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cashiers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-6 text-center text-muted-foreground">
                                        Belum ada kasir.
                                    </td>
                                </tr>
                            ) : (
                                cashiers.map((cashier) => (
                                    <tr key={cashier.id} className="border-b last:border-0">
                                        <td className="py-3 px-4">{cashier.name}</td>
                                        <td className="py-3 px-4">{cashier.email}</td>
                                        <td className="py-3 px-4">{formatDate(cashier.created_at)}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={route('admin.kasir.edit', cashier.id)}>Edit</Link>
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() =>
                                                            setResetPasswordId(
                                                                resetPasswordId === cashier.id ? null : cashier.id,
                                                            )
                                                        }
                                                    >
                                                        Reset Password
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(cashier.id)}
                                                    >
                                                        Hapus
                                                    </Button>
                                                </div>
                                                {resetPasswordId === cashier.id && (
                                                    <ResetPasswordForm
                                                        cashierId={cashier.id}
                                                        onClose={() => setResetPasswordId(null)}
                                                    />
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
        </AppLayout>
    );
}
