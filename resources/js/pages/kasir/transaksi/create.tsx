import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Input Transaksi', href: '/kasir/transaksi' },
];

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
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
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
            <div className="mx-auto max-w-2xl p-6">
                <h1 className="mb-6 text-2xl font-bold">Input Transaksi</h1>

                {flash?.success && (
                    <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-700">{flash.success}</div>
                )}

                {!period ? (
                    <div className="rounded-lg bg-yellow-50 p-4 text-yellow-700">
                        Tidak ada periode kompetisi yang aktif saat ini. Hubungi admin untuk mengaktifkan periode.
                    </div>
                ) : (
                    <>
                        <div className="mb-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
                            Periode Aktif: <strong>{period.name}</strong> ({new Date(period.start_date).toLocaleDateString('id-ID')} - {new Date(period.end_date).toLocaleDateString('id-ID')})
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <div className="relative">
                                <label className="mb-1 block text-sm font-medium">Cari Customer</label>
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => { setQuery(e.target.value); setSelected(null); setData('customer_id', ''); }}
                                    placeholder="Ketik nama, HP, atau email..."
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-mayang-500 focus:ring-mayang-500"
                                />
                                {showDropdown && (
                                    <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-white shadow-lg">
                                        {results.map((c) => (
                                            <li key={c.id} onClick={() => selectCustomer(c)} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                                                <div className="font-medium">{c.name}</div>
                                                <div className="text-xs text-gray-500">{c.email} · {c.phone}</div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {errors.customer_id && <p className="mt-1 text-sm text-red-600">{errors.customer_id}</p>}
                            </div>

                            {selected && (
                                <div className="rounded-lg bg-gray-50 p-3 text-sm">
                                    <p><strong>{selected.name}</strong></p>
                                    <p className="text-gray-500">{selected.email} · {selected.phone}</p>
                                </div>
                            )}

                            <div>
                                <label className="mb-1 block text-sm font-medium">Nominal Belanja (Rp)</label>
                                <input
                                    type="number"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    min="1"
                                    step="1"
                                    placeholder="Contoh: 150000"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-mayang-500 focus:ring-mayang-500"
                                />
                                {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Catatan (opsional)</label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={2}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-mayang-500 focus:ring-mayang-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing || !selected}
                                className="w-full cursor-pointer rounded-lg bg-mayang-600 px-4 py-2 text-white hover:bg-mayang-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Submit Transaksi'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
