import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';

interface Props {
    transaction: {
        id: number;
        amount: string;
        original_amount: string | null;
        notes: string | null;
        receipt_photo: string | null;
        created_at: string;
        edited_at: string | null;
        customer: { name: string; email: string; phone: string };
        period: { name: string } | null;
        cashier: { name: string } | null;
        staff: { name: string } | null;
        editor: { name: string } | null;
        photos: Array<{ id: number }>;
    };
}

const formatRupiah = (val: string | number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(Number(val));

const formatDateTime = (val: string) =>
    new Date(val).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function ShowTransaction({ transaction }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'History Transaksi', href: '/kasir/transaksi/history' },
        { title: 'Detail Transaksi', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Transaksi" />
            <div className="w-full space-y-6 p-6 font-sans">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Detail Transaksi</h1>
                        <p className="mt-1 text-sm text-slate-500">Rincian transaksi yang tercatat.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            className="from-mayang-500 to-mayang-600 hover:from-mayang-600 hover:to-mayang-700 flex items-center gap-1.5 bg-gradient-to-r font-bold text-white"
                            asChild
                        >
                            <Link href={route('kasir.transaksi.edit', transaction.id)}>
                                <Pencil className="h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            className="flex items-center gap-1.5 border-slate-200 transition-colors hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
                            asChild
                        >
                            <Link href={route('kasir.transaksi.history')}>
                                <ArrowLeft className="h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="overflow-hidden border border-slate-200/50 bg-white/70 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60">
                    <div className="grid grid-cols-1 divide-y divide-slate-200/50 sm:grid-cols-2 sm:divide-x sm:divide-y-0 dark:divide-zinc-800/50">
                        <div className="space-y-5 p-6">
                            <div>
                                <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">Customer</p>
                                <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{transaction.customer.name}</p>
                                <p className="text-sm text-slate-500 dark:text-zinc-400">
                                    {transaction.customer.email} · {transaction.customer.phone}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">Nominal Belanja</p>
                                <p className="text-mayang-600 dark:text-mayang-400 mt-1 text-2xl font-black">
                                    {formatRupiah(transaction.amount)}
                                </p>
                                {transaction.original_amount && (
                                    <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                                        Sebelumnya: {formatRupiah(transaction.original_amount)}
                                    </p>
                                )}
                            </div>

                            <div>
                                <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">Catatan</p>
                                <p className="mt-1 text-sm text-slate-700 dark:text-zinc-300">{transaction.notes || '-'}</p>
                            </div>
                        </div>

                        <div className="space-y-5 p-6">
                            <div>
                                <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">Periode</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{transaction.period?.name ?? '-'}</p>
                            </div>

                            <div>
                                <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">Waktu Transaksi</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                                    {formatDateTime(transaction.created_at)}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">Akun Outlet</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{transaction.cashier?.name ?? '-'}</p>
                            </div>

                            <div>
                                <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">Nama Kasir</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{transaction.staff?.name ?? '-'}</p>
                            </div>

                            {transaction.editor && (
                                <div>
                                    <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">Terakhir Diedit</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                                        {transaction.editor.name}
                                        {transaction.edited_at && ` — ${formatDateTime(transaction.edited_at)}`}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {transaction.photos.length > 0 ? (
                        <div className="border-t border-slate-200/50 p-6 dark:border-zinc-800/50">
                            <p className="mb-3 text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">Foto Struk</p>
                            <div className="flex flex-wrap gap-3">
                                {transaction.photos.map((photo, index) => {
                                    const url = route('kasir.transaksi.receipt-photo', [transaction.id, photo.id]);
                                    return (
                                        <a key={photo.id} href={url} target="_blank" rel="noopener noreferrer">
                                            <img
                                                src={url}
                                                alt={`Foto struk ${index + 1}`}
                                                className="h-32 w-32 border border-slate-200 object-cover shadow-sm dark:border-zinc-800"
                                            />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        transaction.receipt_photo && (
                            <div className="border-t border-slate-200/50 p-6 dark:border-zinc-800/50">
                                <p className="mb-3 text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">Foto Struk</p>
                                <a href={route('kasir.transaksi.receipt', transaction.id)} target="_blank" rel="noopener noreferrer">
                                    <img
                                        src={route('kasir.transaksi.receipt', transaction.id)}
                                        alt="Foto struk"
                                        className="h-48 border border-slate-200 object-cover shadow-sm dark:border-zinc-800"
                                    />
                                </a>
                            </div>
                        )
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
