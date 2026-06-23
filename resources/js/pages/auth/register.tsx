import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface RegisterForm {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
}

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Daftar Member" description="Daftarkan dirimu sebagai member Mayang Modest Wear">
            <Head title="Daftar" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-slate-300 font-semibold text-sm">Nama Lengkap</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Nama lengkap"
                            className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-mayang-500/30 focus-visible:border-mayang-500 rounded-xl"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-slate-300 font-semibold text-sm">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@contoh.com"
                            className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-mayang-500/30 focus-visible:border-mayang-500 rounded-xl"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone" className="text-slate-300 font-semibold text-sm">Nomor HP</Label>
                        <Input
                            id="phone"
                            type="text"
                            required
                            tabIndex={3}
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            disabled={processing}
                            placeholder="08xxxxxxxxxx"
                            className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-mayang-500/30 focus-visible:border-mayang-500 rounded-xl"
                        />
                        <InputError message={errors.phone} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-slate-300 font-semibold text-sm">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Minimal 8 karakter"
                            className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-mayang-500/30 focus-visible:border-mayang-500 rounded-xl"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" className="text-slate-300 font-semibold text-sm">Konfirmasi Password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={5}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Ulangi password"
                            className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-mayang-500/30 focus-visible:border-mayang-500 rounded-xl"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="mt-2 w-full rounded-xl bg-gradient-to-r from-mayang-500 to-mayang-600 font-bold hover:from-mayang-600 hover:to-mayang-700 shadow-lg shadow-mayang-500/20 text-white transition-all hover:-translate-y-0.5" tabIndex={6} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Daftar
                    </Button>
                </div>

                <div className="text-slate-400 text-center text-sm">
                    Sudah punya akun?{' '}
                    <TextLink href={route('login')} className="text-mayang-400 hover:text-mayang-300 font-semibold" tabIndex={7}>
                        Login
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
