// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <AuthLayout
            title="Verifikasi Email"
            description="Silakan verifikasi alamat email Anda dengan mengeklik tautan yang baru saja kami kirimkan ke email Anda."
        >
            <Head title="Verifikasi Email" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    Tautan verifikasi baru telah dikirim ke alamat email yang Anda berikan saat mendaftar.
                </div>
            )}

            <form onSubmit={submit} className="space-y-6 text-center">
                <Button
                    disabled={processing}
                    className="from-mayang-500 to-mayang-600 hover:from-mayang-600 hover:to-mayang-700 shadow-mayang-500/20 w-full rounded-xl bg-gradient-to-r font-bold text-white shadow-lg transition-all hover:-translate-y-0.5"
                >
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Kirim Ulang Email Verifikasi
                </Button>

                <TextLink href={route('logout')} method="post" className="text-mayang-400 hover:text-mayang-300 mx-auto block text-sm font-semibold">
                    Log out
                </TextLink>
            </form>
        </AuthLayout>
    );
}
