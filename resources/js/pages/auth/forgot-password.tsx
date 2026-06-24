// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <AuthLayout title="Lupa Password" description="Masukkan email terdaftar untuk menerima link reset password">
            <Head title="Lupa Password" />

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}

            <div className="space-y-6">
                <form onSubmit={submit}>
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-slate-300">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="off"
                            value={data.email}
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                            className="focus-visible:ring-mayang-500/30 focus-visible:border-mayang-500 rounded-xl border-white/10 bg-white/5 text-white placeholder-slate-500"
                        />

                        <InputError message={errors.email} />
                    </div>

                    <div className="my-6 flex items-center justify-start">
                        <Button
                            className="from-mayang-500 to-mayang-600 hover:from-mayang-600 hover:to-mayang-700 shadow-mayang-500/20 w-full rounded-xl bg-gradient-to-r font-bold text-white shadow-lg transition-all hover:-translate-y-0.5"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Kirim Link Reset Password
                        </Button>
                    </div>
                </form>

                <div className="space-x-1 text-center text-sm text-slate-400">
                    <span>Atau, kembali ke</span>
                    <TextLink href={route('login')} className="text-mayang-400 hover:text-mayang-300 font-semibold">
                        login
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
