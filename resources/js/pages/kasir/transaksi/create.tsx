import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { compressImage } from '@/lib/compress-image';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Camera, Landmark, UserCheck2, X } from 'lucide-react';
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

interface Staff {
    id: number;
    name: string;
}

interface Props {
    period: Period | null;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Input Transaksi', href: '/kasir/transaksi' }];

export default function CreateTransaction({ period }: Props) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Customer[]>([]);
    const [selected, setSelected] = useState<Customer | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [compressing, setCompressing] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const [staffQuery, setStaffQuery] = useState('');
    const [staffResults, setStaffResults] = useState<Staff[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [showStaffDropdown, setShowStaffDropdown] = useState(false);
    const staffDebounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const { data, setData, post, processing, errors, reset } = useForm<{
        customer_id: string;
        staff_id: string;
        amount: string;
        notes: string;
        receipt_photos: File[];
        idempotency_key: string;
    }>({
        customer_id: '',
        staff_id: '',
        amount: '',
        notes: '',
        receipt_photos: [],
        idempotency_key: crypto.randomUUID(),
    });

    const MAX_PHOTOS = 3;
    const [previews, setPreviews] = useState<string[]>([]);
    const [displayAmount, setDisplayAmount] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const searchStaff = useCallback((keyword: string) => {
        if (keyword.length < 2) {
            setStaffResults([]);
            setShowStaffDropdown(false);
            return;
        }
        fetch(route('kasir.api.staff.search') + '?q=' + encodeURIComponent(keyword))
            .then((res) => res.json())
            .then((data) => {
                setStaffResults(data);
                setShowStaffDropdown(data.length > 0);
            });
    }, []);

    useEffect(() => {
        if (selectedStaff) return;
        if (staffDebounceRef.current) clearTimeout(staffDebounceRef.current);
        staffDebounceRef.current = setTimeout(() => searchStaff(staffQuery), 300);
        return () => {
            if (staffDebounceRef.current) clearTimeout(staffDebounceRef.current);
        };
    }, [staffQuery, searchStaff, selectedStaff]);

    function selectStaff(staff: Staff) {
        setSelectedStaff(staff);
        setData('staff_id', String(staff.id));
        setStaffQuery(staff.name);
        setShowStaffDropdown(false);
        setStaffResults([]);
    }

    async function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
        const newFiles = Array.from(e.target.files ?? []);
        const remaining = MAX_PHOTOS - data.receipt_photos.length;
        const toProcess = newFiles.slice(0, remaining);
        if (fileInputRef.current) fileInputRef.current.value = '';

        setCompressing(true);
        const compressed = await Promise.all(toProcess.map((f) => compressImage(f)));
        setCompressing(false);

        const files = [...data.receipt_photos, ...compressed];
        setData('receipt_photos', files);
        setPreviews(files.map((file) => URL.createObjectURL(file)));
    }

    function removePhoto(index: number) {
        const files = data.receipt_photos.filter((_, i) => i !== index);
        setData('receipt_photos', files);
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    }

    function submit(e: FormEvent) {
        e.preventDefault();
        if (compressing) return;
        post(route('kasir.transaksi.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setData('idempotency_key', crypto.randomUUID());
                setSelected(null);
                setQuery('');
                setSelectedStaff(null);
                setStaffQuery('');
                setPreviews([]);
                setDisplayAmount('');
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Input Transaksi" />
            <div className="w-full space-y-6 p-6 font-sans">
                <div>
                    <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Input Transaksi</h1>
                    <p className="mt-1 text-sm text-slate-500">Catat transaksi baru untuk kompetisi Top Spender.</p>
                </div>

                {!period ? (
                    <div className=" border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/30 dark:bg-amber-950/10">
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
                    <div className="overflow-hidden border border-slate-200/50 bg-white/70 p-6 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60">
                        <div className="from-mayang-500/10 to-mayang-600/5 border-mayang-500/10 dark:border-mayang-500/10 mb-6 flex items-center gap-3 border bg-gradient-to-r p-4">
                            <div className="bg-mayang-500/10 text-mayang-600 dark:bg-mayang-500/20 dark:text-mayang-400 flex h-9 w-9 items-center justify-center">
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
                                        className="focus-visible:ring-mayang-500/20 focus-visible:border-mayang-500 border-slate-200 bg-white/60 py-5.5 transition-all duration-300 focus-visible:ring-4 dark:border-zinc-800/80 dark:bg-zinc-950/40"
                                    />
                                </div>
                                {showDropdown && (
                                    <ul className="absolute z-10 mt-2 max-h-60 w-full space-y-1 overflow-auto border border-slate-200/50 bg-white/95 p-2 shadow-2xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/95">
                                        {results.map((c) => (
                                            <li
                                                key={c.id}
                                                onClick={() => selectCustomer(c)}
                                                className="hover:bg-mayang-50/80 cursor-pointer border-b border-slate-50/50 px-4 py-3 transition-colors last:border-0 dark:border-zinc-900/30 dark:hover:bg-zinc-900/60"
                                            >
                                                <div className="font-bold text-slate-900 dark:text-white">{c.name}</div>
                                                <div className="mt-0.5 text-xs text-slate-500 dark:text-zinc-400">
                                                    {c.email} · {c.phone}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <InputError message={errors.customer_id} />
                            </div>

                            {selected && (
                                <div className="flex items-start gap-3 border border-slate-200/50 bg-slate-50/40 p-5 dark:border-zinc-800/50 dark:bg-zinc-950/30">
                                    <div className="bg-mayang-500/10 text-mayang-600 mt-0.5 flex h-10 w-10 items-center justify-center">
                                        <UserCheck2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="dark:text-zinc-550 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                            Customer Terpilih
                                        </p>
                                        <p className="mt-1 text-base font-bold text-slate-900 dark:text-white">{selected.name}</p>
                                        <p className="mt-0.5 text-sm text-slate-500 dark:text-zinc-400">
                                            {selected.email} · {selected.phone}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="relative space-y-2">
                                <Label htmlFor="staff_search" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Nama Kasir
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="staff_search"
                                        type="text"
                                        value={staffQuery}
                                        onChange={(e) => {
                                            setStaffQuery(e.target.value);
                                            setSelectedStaff(null);
                                            setData('staff_id', '');
                                        }}
                                        placeholder="Ketik nama kasir..."
                                        className="focus-visible:ring-mayang-500/20 focus-visible:border-mayang-500 border-slate-200 bg-white/60 py-5.5 transition-all duration-300 focus-visible:ring-4 dark:border-zinc-800/80 dark:bg-zinc-950/40"
                                    />
                                </div>
                                {showStaffDropdown && (
                                    <ul className="absolute z-10 mt-2 max-h-60 w-full space-y-1 overflow-auto border border-slate-200/50 bg-white/95 p-2 shadow-2xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/95">
                                        {staffResults.map((s) => (
                                            <li
                                                key={s.id}
                                                onClick={() => selectStaff(s)}
                                                className="hover:bg-mayang-50/80 cursor-pointer border-b border-slate-50/50 px-4 py-3 font-bold text-slate-900 transition-colors last:border-0 dark:border-zinc-900/30 dark:text-white dark:hover:bg-zinc-900/60"
                                            >
                                                {s.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <InputError message={errors.staff_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amount" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Nominal Belanja (Rp)
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="amount"
                                        type="text"
                                        inputMode="numeric"
                                        value={displayAmount}
                                        onChange={(e) => {
                                            const raw = e.target.value.replace(/\D/g, '');
                                            setDisplayAmount(raw ? raw.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '');
                                            setData('amount', raw);
                                        }}
                                        placeholder="Contoh: 150.000"
                                        className="focus-visible:ring-mayang-500/20 focus-visible:border-mayang-500 border-slate-200 bg-white/60 py-5.5 transition-all duration-300 focus-visible:ring-4 dark:border-zinc-800/80 dark:bg-zinc-950/40"
                                    />
                                </div>
                                <InputError message={errors.amount} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Catatan (opsional)
                                </Label>
                                <div className="relative">
                                    <textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={3}
                                        placeholder="Cth: Pembelian gamis & jilbab"
                                        className="focus-visible:ring-mayang-500/20 focus-visible:border-mayang-500 flex min-h-[85px] w-full border border-slate-200 bg-white/60 px-3 py-2.5 text-sm transition-all duration-300 placeholder:text-slate-400 focus-visible:ring-4 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800/80 dark:bg-zinc-950/40 dark:placeholder:text-zinc-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="receipt_photo" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Foto Struk (opsional, maks {MAX_PHOTOS} foto)
                                </Label>
                                {data.receipt_photos.length < MAX_PHOTOS && (
                                    <div className="relative">
                                        <input
                                            ref={fileInputRef}
                                            id="receipt_photo"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFilesChange}
                                            className="focus-visible:ring-mayang-500/20 focus-visible:border-mayang-500 block w-full border border-slate-200 bg-white/60 px-4 py-3 text-sm text-slate-500 transition-all duration-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200 focus-visible:ring-4 focus-visible:outline-none dark:border-zinc-800/80 dark:bg-zinc-950/40"
                                        />
                                        <Camera className="absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                                    </div>
                                )}
                                {previews.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-3">
                                        {previews.map((url, index) => (
                                            <div key={url} className="relative inline-block">
                                                <img
                                                    src={url}
                                                    alt={`Preview struk ${index + 1}`}
                                                    className="h-32 w-32 border border-slate-200 object-cover shadow-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removePhoto(index)}
                                                    className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm transition-colors hover:bg-rose-600"
                                                >
                                                    <X className="size-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <InputError message={errors.receipt_photos} />
                            </div>

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    disabled={processing || compressing || !selected || !selectedStaff}
                                    className="from-mayang-500 to-mayang-600 hover:from-mayang-600 hover:to-mayang-700 shadow-mayang-500/20 hover:shadow-mayang-500/30 w-full bg-gradient-to-r px-8 py-5.5 font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 sm:w-auto"
                                >
                                    {compressing ? 'Mengompres foto...' : processing ? 'Menyimpan...' : 'Submit Transaksi'}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
