import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, KeyRound, PencilLine } from 'lucide-react';
import { FormEvent } from 'react';

interface Props {
    customer: {
        id: number;
        name: string;
        email: string;
        phone: string;
        user_id: number | null;
    };
}

function ResetPasswordCard({ customerId, customerName }: { customerId: number; customerName: string }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        password: '',
        password_confirmation: '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        put(route('admin.customer.reset-password', customerId), {
            onSuccess: () => reset(),
        });
    }

    return (
        <div className="overflow-hidden border border-slate-200/50 bg-white/70 p-6 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60">
            <form onSubmit={submit} className="max-w-2xl space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-zinc-800/80">
                    <div className="bg-mayang-500/10 text-mayang-600 dark:bg-mayang-500/20 dark:text-mayang-400 flex h-10 w-10 items-center justify-center">
                        <KeyRound className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Reset Password</h3>
                        <p className="text-xs text-slate-500">Setel password baru untuk akun login {customerName}, misalnya karena customer lupa password.</p>
                    </div>
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
                        placeholder="Minimal 8 karakter"
                        className="focus-visible:ring-mayang-500/20 focus-visible:border-mayang-500 border-slate-200 bg-white/60 py-5.5 transition-all duration-300 focus-visible:ring-4 dark:border-zinc-800/80 dark:bg-zinc-950/40"
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password_confirmation" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Konfirmasi Password
                    </Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        placeholder="Ulangi password baru"
                        className="focus-visible:ring-mayang-500/20 focus-visible:border-mayang-500 border-slate-200 bg-white/60 py-5.5 transition-all duration-300 focus-visible:ring-4 dark:border-zinc-800/80 dark:bg-zinc-950/40"
                    />
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="from-mayang-500 to-mayang-600 hover:from-mayang-600 hover:to-mayang-700 shadow-mayang-500/20 hover:shadow-mayang-500/30 w-full bg-gradient-to-r px-8 py-5.5 font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 sm:w-auto"
                    >
                        {processing ? 'Menyimpan...' : 'Reset Password'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

function SetPasswordCard({ customerId, customerName }: { customerId: number; customerName: string }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        password: '',
        password_confirmation: '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        put(route('admin.customer.set-password', customerId), {
            onSuccess: () => reset(),
        });
    }

    return (
        <div className="overflow-hidden border border-slate-200/50 bg-white/70 p-6 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60">
            <form onSubmit={submit} className="max-w-2xl space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-zinc-800/80">
                    <div className="bg-mayang-500/10 text-mayang-600 dark:bg-mayang-500/20 dark:text-mayang-400 flex h-10 w-10 items-center justify-center">
                        <KeyRound className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Buat Akun Login</h3>
                        <p className="text-xs text-slate-500">
                            Customer ini belum punya akun login (didaftarkan sebelum fitur password tersedia). Setel password untuk membuatkan
                            akunnya sekarang.
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="new_password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Password
                    </Label>
                    <Input
                        id="new_password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Minimal 8 karakter"
                        className="focus-visible:ring-mayang-500/20 focus-visible:border-mayang-500 border-slate-200 bg-white/60 py-5.5 transition-all duration-300 focus-visible:ring-4 dark:border-zinc-800/80 dark:bg-zinc-950/40"
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="new_password_confirmation" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Konfirmasi Password
                    </Label>
                    <Input
                        id="new_password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        placeholder="Ulangi password"
                        className="focus-visible:ring-mayang-500/20 focus-visible:border-mayang-500 border-slate-200 bg-white/60 py-5.5 transition-all duration-300 focus-visible:ring-4 dark:border-zinc-800/80 dark:bg-zinc-950/40"
                    />
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="from-mayang-500 to-mayang-600 hover:from-mayang-600 hover:to-mayang-700 shadow-mayang-500/20 hover:shadow-mayang-500/30 w-full bg-gradient-to-r px-8 py-5.5 font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 sm:w-auto"
                    >
                        {processing ? 'Menyimpan...' : 'Buat Akun & Password'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Customer', href: '/admin/customer' },
    { title: 'Edit', href: '#' },
];

export default function EditCustomer({ customer }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        put(route('admin.customer.update', customer.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Customer" />
            <div className="max-w-4xl space-y-6 p-6 font-sans">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Edit Customer</h1>
                        <p className="mt-1 text-sm text-slate-500">Perbarui data profil customer.</p>
                    </div>
                    <Button
                        variant="outline"
                        className="flex items-center gap-1.5 border-slate-200 transition-colors hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
                        asChild
                    >
                        <Link href={route('admin.customer.index')}>
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden border border-slate-200/50 bg-white/70 p-6 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60">
                    <form onSubmit={submit} className="max-w-2xl space-y-6">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-zinc-800/80">
                            <div className="bg-mayang-500/10 text-mayang-600 dark:bg-mayang-500/20 dark:text-mayang-400 flex h-10 w-10 items-center justify-center">
                                <PencilLine className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Detail Profil Customer</h3>
                                <p className="text-xs text-slate-500">Ubah nama lengkap, alamat email, atau nomor HP.</p>
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
                                placeholder="Nama lengkap customer"
                                className="focus-visible:ring-mayang-500/20 focus-visible:border-mayang-500 border-slate-200 bg-white/60 py-5.5 transition-all duration-300 focus-visible:ring-4 dark:border-zinc-800/80 dark:bg-zinc-950/40"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="customer@email.com"
                                className="focus-visible:ring-mayang-500/20 focus-visible:border-mayang-500 border-slate-200 bg-white/60 py-5.5 transition-all duration-300 focus-visible:ring-4 dark:border-zinc-800/80 dark:bg-zinc-950/40"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Nomor HP
                            </Label>
                            <Input
                                id="phone"
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="08xxxxxxxxxx"
                                className="focus-visible:ring-mayang-500/20 focus-visible:border-mayang-500 border-slate-200 bg-white/60 py-5.5 transition-all duration-300 focus-visible:ring-4 dark:border-zinc-800/80 dark:bg-zinc-950/40"
                            />
                            <InputError message={errors.phone} />
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="from-mayang-500 to-mayang-600 hover:from-mayang-600 hover:to-mayang-700 shadow-mayang-500/20 hover:shadow-mayang-500/30 w-full bg-gradient-to-r px-8 py-5.5 font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 sm:w-auto"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                    </form>
                </div>

                {customer.user_id ? (
                    <ResetPasswordCard customerId={customer.id} customerName={customer.name} />
                ) : (
                    <SetPasswordCard customerId={customer.id} customerName={customer.name} />
                )}
            </div>
        </AppLayout>
    );
}
