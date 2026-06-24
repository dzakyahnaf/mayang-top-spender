import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { CircleDollarSign, Landmark, NotebookText, Search, UserCheck2 } from 'lucide-react';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
}

interface Period {
    name: string;
    start_date: string;
    end_date: string;
}

interface Props {
    period: Period | null;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Input Transaksi', href: '/kasir/transaksi' }];

export default function CreateTransaction({ period }: Props) {
    const { flash } = usePage<SharedData>().props;
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Customer[]>([]);
    const [selected, setSelected] = useState<Customer | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>();

    const { data, setData, post, processing, errors, reset } = useForm({
        customer_id: '',
        amount: '',
        notes: '',
    });

    const searchCustomers = useCallback((keyword: string) => {
        if (keyword.length < 2) {
            setResults([]);
            setShowDropdown(false);
            return;
        }
        fetch(route('kasir.api.customers.search') + '?q=' + encodeURIComponent(keyword))
            .then((res) => res.json())
            .then((data) => {
                setResults(data);
                setShowDropdown(data.length > 0);
            });
    }, []);

    useEffect(() => {
        if (selected) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => searchCustomers(query), 300);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query, searchCustomers, selected]);

    function selectCustomer(customer: Customer) {
        setSelected(customer);
        setData('customer_id', String(customer.id));
        setQuery(customer.name);
        setShowDropdown(false);
        setResults([]);
    }

    function submit(e: FormEvent) {
        e.preventDefault();
        post(route('kasir.transaksi.store'), {
            onSuccess: () => {
                reset();
                setSelected(null);
                setQuery('');
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Input Transaksi" />
            <div className="max-w-4xl space-y-6 p-6 font-sans">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Input Transaksi</h1>
                    <p className="mt-1 text-sm text-slate-500">Catat transaksi baru untuk kompetisi Top Spender.</p>
                </div>

                {flash?.success && (
                    <div className="bg-mayang-50 border-mayang-100 dark:bg-mayang-950/20 dark:border-mayang-900/30 animate-in fade-in slide-in-from-top-2 mb-6 rounded-2xl border p-4 duration-300">
                        <div className="flex items-center gap-3">
                            <div className="bg-mayang-500 flex h-8 w-8 items-center justify-center rounded-full text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <p className="text-mayang-800 dark:text-mayang-300 text-sm font-semibold">{flash.success}</p>
                        </div>
                    </div>
                )}

                {!period ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/30 dark:bg-amber-950/10">
                        <div className="flex gap-3">
                            <svg
                                className="h-6 w-6 flex-shrink-0 text-amber-600 dark:text-amber-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                            <div>
                                <h3 className="font-bold text-amber-800 dark:text-amber-400">Kompetisi Tidak Aktif</h3>
                                <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                                    Tidak ada periode kompetisi yang aktif saat ini. Hubungi admin untuk mengaktifkan periode baru.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white/50 p-6 shadow-xl backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-900/40">
                        <div className="from-mayang-500/10 to-mayang-600/5 border-mayang-100/50 dark:border-mayang-900/30 mb-6 flex items-center gap-3 rounded-2xl border bg-gradient-to-r p-4">
                            <div className="bg-mayang-500/10 text-mayang-600 flex h-9 w-9 items-center justify-center rounded-xl">
                                <Landmark className="h-5 w-5" />
                            </div>
                            <p className="text-mayang-700 dark:text-mayang-400 text-sm font-semibold">
                                Periode Aktif: <strong className="text-mayang-600 dark:text-mayang-300">{period.name}</strong> (
                                {new Date(period.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} -{' '}
                                {new Date(period.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })})
                            </p>
                        </div>

                        <form onSubmit={submit} className="max-w-2xl space-y-6">
                            <div className="relative space-y-2">
                                <Label htmlFor="search" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Cari Customer
                                </Label>
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        id="search"
                                        type="text"
                                        value={query}
                                        onChange={(e) => {
                                            setQuery(e.target.value);
                                            setSelected(null);
                                            setData('customer_id', '');
                                        }}
                                        placeholder="Ketik nama, nomor HP, atau email..."
                                        className="focus-visible:ring-mayang-500/30 focus-visible:border-mayang-500 rounded-xl bg-white/50 py-5 pl-10"
                                    />
                                </div>
                                {showDropdown && (
                                    <ul className="absolute z-10 mt-2 max-h-60 w-full space-y-1 overflow-auto rounded-2xl border border-slate-100 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-950">
                                        {results.map((c) => (
                                            <li
                                                key={c.id}
                                                onClick={() => selectCustomer(c)}
                                                className="hover:bg-mayang-50 dark:hover:bg-mayang-950/50 cursor-pointer rounded-xl border-b border-slate-50 px-4 py-3 transition-colors last:border-0 dark:border-slate-900"
                                            >
                                                <div className="font-bold text-slate-900 dark:text-white">{c.name}</div>
                                                <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                                    {c.email} · {c.phone}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <InputError message={errors.customer_id} />
                            </div>

                            {selected && (
                                <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 dark:border-slate-800/50 dark:bg-slate-950/20">
                                    <div className="bg-mayang-500/10 text-mayang-600 mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl">
                                        <UserCheck2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                            Customer Terpilih
                                        </p>
                                        <p className="mt-1 text-base font-bold text-slate-900 dark:text-white">{selected.name}</p>
                                        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                                            {selected.email} · {selected.phone}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="amount" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Nominal Belanja (Rp)
                                </Label>
                                <div className="relative">
                                    <CircleDollarSign className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        id="amount"
                                        type="number"
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        min="1"
                                        step="1"
                                        placeholder="Contoh: 150000"
                                        className="focus-visible:ring-mayang-500/30 focus-visible:border-mayang-500 rounded-xl bg-white/50 py-5 pl-10"
                                    />
                                </div>
                                <InputError message={errors.amount} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Catatan (opsional)
                                </Label>
                                <div className="relative">
                                    <NotebookText className="absolute top-3 left-3.5 h-4 w-4 text-slate-400" />
                                    <textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={3}
                                        placeholder="Cth: Pembelian gamis & jilbab"
                                        className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-mayang-500/30 flex min-h-[80px] w-full rounded-xl border border-slate-200 bg-white/50 py-2 pr-3 pl-10 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-950/20"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    disabled={processing || !selected}
                                    className="from-mayang-500 to-mayang-600 hover:from-mayang-600 hover:to-mayang-700 shadow-mayang-500/20 w-full rounded-xl bg-gradient-to-r px-8 py-5 font-bold text-white shadow-md sm:w-auto"
                                >
                                    {processing ? 'Menyimpan...' : 'Submit Transaksi'}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
