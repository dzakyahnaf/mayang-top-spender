import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, UserCheck } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Props {
    cashier: {
        id: number;
        name: string;
        email: string;
    };
}

export default function KasirEdit({ cashier }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Kasir', href: '/admin/kasir' },
        { title: 'Edit', href: `/admin/kasir/${cashier.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: cashier.name,
        email: cashier.email,
        password: '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.kasir.update', cashier.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Kasir" />
            <div className="max-w-4xl space-y-6 p-6 font-sans">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Edit Kasir</h1>
                        <p className="mt-1 text-sm text-slate-500">Ubah informasi akun kasir pilihan.</p>
                    </div>
                    <Button variant="outline" className="flex items-center gap-1.5 rounded-xl" asChild>
                        <Link href={route('admin.kasir.index')}>
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white/50 p-6 shadow-xl backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-900/40">
                    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                        <div className="dark:border-slate-855 flex items-center gap-2 border-b border-slate-100 pb-4">
                            <div className="bg-mayang-500/10 text-mayang-600 flex h-10 w-10 items-center justify-center rounded-xl">
                                <UserCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Informasi Akun</h3>
                                <p className="text-xs text-slate-500">Perbarui nama, email atau ubah password akun kasir.</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Nama Lengkap
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="focus-visible:ring-mayang-500/30 focus-visible:border-mayang-500 rounded-xl bg-white/50 py-5"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Alamat Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="focus-visible:ring-mayang-500/30 focus-visible:border-mayang-500 rounded-xl bg-white/50 py-5"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Password Baru
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Kosongkan jika tidak ingin mengubah password"
                                className="focus-visible:ring-mayang-500/30 focus-visible:border-mayang-500 rounded-xl bg-white/50 py-5"
                            />
                            <InputError message={errors.password} />
                            <p className="text-xs text-slate-500 italic">
                                * Biarkan kosong jika Anda tidak bermaksud untuk mengganti password kasir ini.
                            </p>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="from-mayang-500 to-mayang-600 hover:from-mayang-600 hover:to-mayang-700 shadow-mayang-500/20 w-full rounded-xl bg-gradient-to-r px-8 py-5 font-bold text-white shadow-md sm:w-auto"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
