import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface ResetPasswordProps {
    token: string;
    email: string;
}

interface ResetPasswordForm {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors, reset } = useForm<ResetPasswordForm>({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Reset Password" description="Silakan masukkan password baru Anda di bawah ini">
            <Head title="Reset Password" />

            <form onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-slate-300">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            value={data.email}
                            className="focus-visible:ring-mayang-500/30 focus-visible:border-mayang-500 border-white/10 bg-white/5 text-white placeholder-slate-500"
                            readOnly
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-sm font-semibold text-slate-300">
                            Password Baru
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            autoComplete="new-password"
                            value={data.password}
                            className="focus-visible:ring-mayang-500/30 focus-visible:border-mayang-500 border-white/10 bg-white/5 text-white placeholder-slate-500"
                            autoFocus
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password Baru"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" className="text-sm font-semibold text-slate-300">
                            Konfirmasi Password Baru
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            className="focus-visible:ring-mayang-500/30 focus-visible:border-mayang-500 border-white/10 bg-white/5 text-white placeholder-slate-500"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="Konfirmasi Password Baru"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button
                        type="submit"
                        className="from-mayang-500 to-mayang-600 hover:from-mayang-600 hover:to-mayang-700 shadow-mayang-500/20 mt-2 w-full bg-gradient-to-r font-bold text-white shadow-lg transition-all hover:-translate-y-0.5"
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Reset Password
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
