import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { UserPlus2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Daftarkan Customer', href: '/kasir/customer/create' },
];

export default function CreateCustomer() {
    const { flash } = usePage<SharedData>().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post(route('kasir.customer.store'), { onSuccess: () => reset() });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftarkan Customer Baru" />
            <div className="p-6 max-w-4xl space-y-6 font-sans">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Daftarkan Customer Baru</h1>
                    <p className="text-sm text-slate-500 mt-1">Daftarkan akun customer baru ke dalam database sistem.</p>
                </div>

                {flash?.success && (
                    <div className="mb-6 rounded-2xl bg-mayang-50 border border-mayang-100 p-4 dark:bg-mayang-950/20 dark:border-mayang-900/30 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mayang-500 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold text-mayang-800 dark:text-mayang-300">{flash.success}</p>
                        </div>
                    </div>
                )}

                <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white/50 p-6 shadow-xl dark:border-slate-800/50 dark:bg-slate-900/40 backdrop-blur-md">
                    <form onSubmit={submit} className="max-w-2xl space-y-6">
                        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-855">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mayang-500/10 text-mayang-600">
                                <UserPlus2 className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Detail Profil Customer</h3>
                                <p className="text-xs text-slate-500">Masukkan nama lengkap, alamat email, dan nomor HP aktif.</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nama Lengkap</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Nama lengkap customer"
                                className="bg-white/50 focus-visible:ring-mayang-500/30 focus-visible:border-mayang-500 rounded-xl py-5"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="customer@email.com"
                                className="bg-white/50 focus-visible:ring-mayang-500/30 focus-visible:border-mayang-500 rounded-xl py-5"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nomor HP</Label>
                            <Input
                                id="phone"
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="08xxxxxxxxxx"
                                className="bg-white/50 focus-visible:ring-mayang-500/30 focus-visible:border-mayang-500 rounded-xl py-5"
                            />
                            <InputError message={errors.phone} />
                        </div>

                        <div className="pt-2">
                            <Button type="submit" disabled={processing} className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-mayang-500 to-mayang-600 text-white hover:from-mayang-600 hover:to-mayang-700 shadow-md shadow-mayang-500/20 font-bold px-8 py-5">
                                {processing ? 'Menyimpan...' : 'Daftarkan Customer'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
