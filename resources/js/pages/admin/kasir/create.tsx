import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { FormEventHandler } from 'react';
import { ArrowLeft, UserPlus } from 'lucide-react';

export default function KasirCreate() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Kasir', href: '/admin/kasir' },
        { title: 'Tambah', href: '/admin/kasir/create' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.kasir.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Kasir" />
            <div className="p-6 max-w-4xl space-y-6 font-sans">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Tambah Kasir</h1>
                        <p className="text-sm text-slate-500 mt-1">Buat akun kasir baru untuk sistem kasir belanja.</p>
                    </div>
                    <Button variant="outline" className="rounded-xl flex items-center gap-1.5" asChild>
                        <Link href={route('admin.kasir.index')}>
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white/50 p-6 shadow-xl dark:border-slate-800/50 dark:bg-slate-900/40 backdrop-blur-md">
                    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-850">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mayang-500/10 text-mayang-600">
                                <UserPlus className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Informasi Akun Kasir</h3>
                                <p className="text-xs text-slate-500">Masukkan detail nama, email, dan password awal.</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nama Lengkap</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Nama lengkap kasir"
                                className="bg-white/50 focus-visible:ring-mayang-500/30 focus-visible:border-mayang-500 rounded-xl py-5"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Alamat Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@contoh.com"
                                className="bg-white/50 focus-visible:ring-mayang-500/30 focus-visible:border-mayang-500 rounded-xl py-5"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Masukkan password akun"
                                className="bg-white/50 focus-visible:ring-mayang-500/30 focus-visible:border-mayang-500 rounded-xl py-5"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="pt-2">
                            <Button type="submit" disabled={processing} className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-mayang-500 to-mayang-600 text-white hover:from-mayang-600 hover:to-mayang-700 shadow-md shadow-mayang-500/20 font-bold px-8 py-5">
                                {processing ? 'Menyimpan...' : 'Simpan Akun'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
