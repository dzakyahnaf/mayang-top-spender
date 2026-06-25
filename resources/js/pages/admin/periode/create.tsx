import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CalendarPlus } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function PeriodeCreate() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Periode', href: '/admin/periode' },
        { title: 'Tambah', href: '/admin/periode/create' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        start_date: '',
        end_date: '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.periode.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Periode" />
            <div className="max-w-4xl space-y-6 p-6 font-sans">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Tambah Periode</h1>
                        <p className="mt-1 text-sm text-slate-500">Buat periode kompetisi Top Spender baru.</p>
                    </div>
                    <Button
                        variant="outline"
                        className="flex items-center gap-1.5 rounded-xl border-slate-200 transition-colors hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
                        asChild
                    >
                        <Link href={route('admin.periode.index')}>
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-200/50 bg-white/70 p-6 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60">
                    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-zinc-800/80">
                            <div className="bg-mayang-500/10 text-mayang-600 dark:bg-mayang-500/20 dark:text-mayang-400 flex h-10 w-10 items-center justify-center rounded-xl">
                                <CalendarPlus className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Informasi Periode</h3>
                                <p className="text-xs text-slate-500">Tentukan nama dan rentang tanggal untuk kompetisi baru.</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Nama Periode
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Contoh: Periode Januari 2026"
                                className="focus-visible:ring-mayang-500/20 focus-visible:border-mayang-500 rounded-xl border-slate-200 bg-white/60 py-5.5 transition-all duration-300 focus-visible:ring-4 dark:border-zinc-800/80 dark:bg-zinc-950/40"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="start_date" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Tanggal Mulai
                                </Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className="focus-visible:ring-mayang-500/20 focus-visible:border-mayang-500 rounded-xl border-slate-200 bg-white/60 py-5.5 transition-all duration-300 focus-visible:ring-4 dark:border-zinc-800/80 dark:bg-zinc-950/40"
                                />
                                <InputError message={errors.start_date} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="end_date" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Tanggal Selesai
                                </Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    className="focus-visible:ring-mayang-500/20 focus-visible:border-mayang-500 rounded-xl border-slate-200 bg-white/60 py-5.5 transition-all duration-300 focus-visible:ring-4 dark:border-zinc-800/80 dark:bg-zinc-950/40"
                                />
                                <InputError message={errors.end_date} />
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="from-mayang-500 to-mayang-600 hover:from-mayang-600 hover:to-mayang-700 shadow-mayang-500/20 hover:shadow-mayang-500/30 w-full rounded-xl bg-gradient-to-r px-8 py-5.5 font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 sm:w-auto"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Periode'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
