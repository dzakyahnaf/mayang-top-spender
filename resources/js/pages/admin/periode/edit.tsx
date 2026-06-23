import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { FormEventHandler } from 'react';
import { ArrowLeft, CalendarRange } from 'lucide-react';

interface Props {
    period: {
        id: number;
        name: string;
        start_date: string;
        end_date: string;
    };
}

export default function PeriodeEdit({ period }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Periode', href: '/admin/periode' },
        { title: 'Edit', href: `/admin/periode/${period.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: period.name,
        start_date: period.start_date,
        end_date: period.end_date,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.periode.update', period.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Periode" />
            <div className="p-6 max-w-4xl space-y-6 font-sans">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Edit Periode</h1>
                        <p className="text-sm text-slate-500 mt-1">Ubah rentang waktu atau informasi kompetisi.</p>
                    </div>
                    <Button variant="outline" className="rounded-xl flex items-center gap-1.5" asChild>
                        <Link href={route('admin.periode.index')}>
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white/50 p-6 shadow-xl dark:border-slate-800/50 dark:bg-slate-900/40 backdrop-blur-md">
                    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-855">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mayang-500/10 text-mayang-600">
                                <CalendarRange className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Informasi Periode</h3>
                                <p className="text-xs text-slate-500">Edit data nama dan tanggal mulai/selesai di bawah.</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nama Periode</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="bg-white/50 focus-visible:ring-mayang-500/30 focus-visible:border-mayang-500 rounded-xl py-5"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="start_date" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tanggal Mulai</Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className="bg-white/50 focus-visible:ring-mayang-500/30 focus-visible:border-mayang-500 rounded-xl py-5"
                                />
                                <InputError message={errors.start_date} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="end_date" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tanggal Selesai</Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    className="bg-white/50 focus-visible:ring-mayang-500/30 focus-visible:border-mayang-500 rounded-xl py-5"
                                />
                                <InputError message={errors.end_date} />
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button type="submit" disabled={processing} className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-mayang-500 to-mayang-600 text-white hover:from-mayang-600 hover:to-mayang-700 shadow-md shadow-mayang-500/20 font-bold px-8 py-5">
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
