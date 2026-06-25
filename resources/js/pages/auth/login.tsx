import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Masuk" description="Masuk dengan email/nomor telepon terdaftar">
            <Head title="Log in" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-sm font-bold text-slate-700">
                            Email address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                            className="focus:border-mayang-500 focus:ring-mayang-500/10 focus-visible:ring-mayang-500/10 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm transition-all outline-none focus:ring-4"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password" className="text-sm font-bold text-slate-700">
                                Password
                            </Label>
                            {canResetPassword && (
                                <TextLink
                                    href={route('password.request')}
                                    className="text-mayang-600 hover:text-mayang-700 ml-auto text-sm"
                                    tabIndex={5}
                                >
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                            className="focus:border-mayang-500 focus:ring-mayang-500/10 focus-visible:ring-mayang-500/10 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 shadow-sm transition-all outline-none focus:ring-4"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3 text-slate-700">
                        <Checkbox
                            id="remember"
                            name="remember"
                            tabIndex={3}
                            className="data-[state=checked]:border-mayang-500 data-[state=checked]:bg-mayang-500 border-slate-300"
                        />
                        <Label htmlFor="remember" className="text-sm font-medium text-slate-700">
                            Remember me
                        </Label>
                    </div>

                    <Button
                        type="submit"
                        className="bg-mayang-500 hover:bg-mayang-600 mt-4 w-full rounded-xl font-bold text-white shadow-sm transition-all hover:shadow-md"
                        tabIndex={4}
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Log in
                    </Button>
                </div>

                <div className="text-center text-sm text-slate-500">
                    Don't have an account?{' '}
                    <TextLink href={route('register')} className="text-mayang-600 hover:text-mayang-700 font-semibold" tabIndex={5}>
                        Sign up
                    </TextLink>
                </div>
            </form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
