import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Gift } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Reward {
    id: number;
    rank_start: number;
    rank_end: number;
    title: string;
    description: string | null;
    sort_order: number;
}

interface Props {
    reward: Reward;
}

const inputClass =
    'focus-visible:ring-mayang-500/20 focus-visible:border-mayang-500 rounded-xl bg-white/60 dark:bg-zinc-950/40 border-slate-200 dark:border-zinc-800/80 py-5.5 focus-visible:ring-4 transition-all duration-300';

export default function HadiahEdit({ reward }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Hadiah', href: '/admin/hadiah' },
        { title: 'Edit', href: `/admin/hadiah/${reward.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        rank_start: String(reward.rank_start),
        rank_end: String(reward.rank_end),
        title: reward.title,
        description: reward.description ?? '',
        sort_order: String(reward.sort_order),
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.hadiah.update', reward.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Hadiah" />
            <div className="max-w-4xl space-y-6 p-6 font-sans">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Edit Hadiah</h1>
                        <p className="mt-1 text-sm text-slate-500">Perbarui hadiah untuk rentang peringkat.</p>
                    </div>
                    <Button
                        variant="outline"
                        className="flex items-center gap-1.5 rounded-xl border-slate-200 transition-colors hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
                        asChild
                    >
                        <Link href={route('admin.hadiah.index')}>
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-200/50 bg-white/70 p-6 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60">
                    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-zinc-800/80">
                            <div className="bg-mayang-500/10 text-mayang-600 dark:bg-mayang-500/20 dark:text-mayang-400 flex h-10 w-10 items-center justify-center rounded-xl">
                                <Gift className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Informasi Hadiah</h3>
                                <p className="text-xs text-slate-500">Misal peringkat 3-5 mendapatkan Voucher Belanja Rp 2.000.000.</p>
                            </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="rank_start" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Peringkat Awal
                                </Label>
                                <Input
                                    id="rank_start"
                                    type="number"
                                    min={1}
                                    value={data.rank_start}
                                    onChange={(e) => setData('rank_start', e.target.value)}
                                    className={inputClass}
                                />
                                <InputError message={errors.rank_start} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rank_end" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Peringkat Akhir
                                </Label>
                                <Input
                                    id="rank_end"
                                    type="number"
                                    min={1}
                                    value={data.rank_end}
                                    onChange={(e) => setData('rank_end', e.target.value)}
                                    className={inputClass}
                                />
                                <InputError message={errors.rank_end} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Nama Hadiah
                            </Label>
                            <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} className={inputClass} />
                            <InputError message={errors.title} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Keterangan (opsional)
                            </Label>
                            <Input
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className={inputClass}
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sort_order" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Urutan Tampil (opsional)
                            </Label>
                            <Input
                                id="sort_order"
                                type="number"
                                min={0}
                                value={data.sort_order}
                                onChange={(e) => setData('sort_order', e.target.value)}
                                className={inputClass}
                            />
                            <InputError message={errors.sort_order} />
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="from-mayang-500 to-mayang-600 hover:from-mayang-600 hover:to-mayang-700 shadow-mayang-500/20 hover:shadow-mayang-500/30 w-full rounded-xl bg-gradient-to-r px-8 py-5.5 font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 sm:w-auto"
                            >
                                {processing ? 'Menyimpan...' : 'Perbarui Hadiah'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
