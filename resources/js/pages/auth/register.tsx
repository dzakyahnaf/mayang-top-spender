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
        <AuthLayout title="Daftar Member" description="Daftarkan dirimu sebagai bagian dari program top spender berhadiah Umroh!">
            <Head title="Daftar" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-sm font-bold text-slate-700">
                            Nama Lengkap
                        </Label>
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
                            className="focus:border-mayang-500 focus:ring-mayang-500/10 focus-visible:ring-mayang-500/10 block w-full border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-all outline-none focus:ring-4"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-sm font-bold text-slate-700">
                            Email
                        </Label>
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
                            className="focus:border-mayang-500 focus:ring-mayang-500/10 focus-visible:ring-mayang-500/10 block w-full border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-all outline-none focus:ring-4"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone" className="text-sm font-bold text-slate-700">
                            Nomor HP
                        </Label>
                        <Input
                            id="phone"
                            type="text"
                            required
                            tabIndex={3}
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            disabled={processing}
                            placeholder="08xxxxxxxxxx"
                            className="focus:border-mayang-500 focus:ring-mayang-500/10 focus-visible:ring-mayang-500/10 block w-full border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-all outline-none focus:ring-4"
                        />
                        <InputError message={errors.phone} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-sm font-bold text-slate-700">
                            Password
                        </Label>
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
                            className="focus:border-mayang-500 focus:ring-mayang-500/10 focus-visible:ring-mayang-500/10 block w-full border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-all outline-none focus:ring-4"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" className="text-sm font-bold text-slate-700">
                            Konfirmasi Password
                        </Label>
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
                            className="focus:border-mayang-500 focus:ring-mayang-500/10 focus-visible:ring-mayang-500/10 block w-full border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-all outline-none focus:ring-4"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button
                        type="submit"
                        className="bg-mayang-500 hover:bg-mayang-600 mt-4 w-full py-5 text-xs font-bold tracking-[0.2em] text-white uppercase transition-all"
                        tabIndex={6}
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Daftar
                    </Button>
                </div>

                <div className="text-center text-sm text-slate-500">
                    Sudah punya akun?{' '}
                    <TextLink href={route('login')} className="text-mayang-600 hover:text-mayang-700 font-semibold" tabIndex={7}>
                        Login
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
