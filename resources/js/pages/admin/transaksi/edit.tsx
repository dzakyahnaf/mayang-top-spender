import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, PencilLine } from 'lucide-react';
import { FormEvent } from 'react';

interface Props {
    transaction: {
        id: number;
        amount: number;
        notes: string | null;
        customer: { name: string };
        period: { name: string };
    };
}

export default function EditTransaction({ transaction }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Transaksi', href: '/admin/transaksi' },
        { title: 'Edit', href: '#' },
    ];

    const { data, setData, put, processing, errors } = useForm({
        amount: String(transaction.amount),
        notes: transaction.notes || '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        put(route('admin.transaksi.update', transaction.id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Transaksi" />
            <div className="max-w-4xl space-y-6 p-6 font-sans">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Edit Transaksi</h1>
                        <p className="mt-1 text-sm text-slate-500">Sesuaikan nominal belanja atau catatan transaksi.</p>
                    </div>
                    <Button
                        variant="outline"
                        className="flex items-center gap-1.5 rounded-xl border-slate-200 transition-colors hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
                        asChild
                    >
                        <Link href={route('admin.transaksi.index')}>
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-200/50 bg-white/70 p-6 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60">
                    <form onSubmit={submit} className="max-w-2xl space-y-6">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-zinc-800/80">
                            <div className="bg-mayang-500/10 text-mayang-600 dark:bg-mayang-500/20 dark:text-mayang-400 flex h-10 w-10 items-center justify-center rounded-xl">
                                <PencilLine className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Detail Transaksi</h3>
                                <p className="text-xs text-slate-500">
                                    Customer: <strong className="text-slate-900 dark:text-white">{transaction.customer.name}</strong> • Periode:{' '}
                                    <strong className="text-slate-900 dark:text-white">{transaction.period.name}</strong>
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Nominal Belanja (Rp)
                            </Label>
                            <Input
                                id="amount"
                                type="number"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                min="1"
                                className="focus-visible:ring-mayang-500/20 focus-visible:border-mayang-500 rounded-xl border-slate-200 bg-white/60 py-5.5 transition-all duration-300 focus-visible:ring-4 dark:border-zinc-800/80 dark:bg-zinc-950/40"
                            />
                            <InputError message={errors.amount} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Catatan Tambahan
                            </Label>
                            <textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                rows={3}
                                placeholder="Tulis catatan jika diperlukan..."
                                className="focus-visible:ring-mayang-500/20 focus-visible:border-mayang-500 flex min-h-[80px] w-full rounded-xl border border-slate-200 bg-white/60 px-3 py-2 text-sm transition-all duration-300 focus-visible:ring-4 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800/80 dark:bg-zinc-950/40 dark:text-white"
                            />
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="from-mayang-500 to-mayang-600 hover:from-mayang-600 hover:to-mayang-700 shadow-mayang-500/20 hover:shadow-mayang-500/30 w-full rounded-xl bg-gradient-to-r px-8 py-5.5 font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 sm:w-auto"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
