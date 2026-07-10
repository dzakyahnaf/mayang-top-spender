import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { compressImage } from '@/lib/compress-image';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Camera, PencilLine, UserCheck2, X } from 'lucide-react';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
}

interface Staff {
    id: number;
    name: string;
}

interface Period {
    id: number;
    name: string;
}

interface ExistingPhoto {
    id: number;
}

interface Props {
    transaction: {
        id: number;
        amount: number;
        notes: string | null;
        customer: Customer;
        staff: Staff | null;
        period: Period | null;
        photos: ExistingPhoto[];
    };
    periods: Period[];
}

const MAX_PHOTOS = 3;

export default function EditTransaction({ transaction, periods }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Transaksi', href: '/admin/transaksi' },
        { title: 'Edit', href: '#' },
    ];

    const [query, setQuery] = useState(transaction.customer.name);
    const [results, setResults] = useState<Customer[]>([]);
    const [selected, setSelected] = useState<Customer | null>(transaction.customer);
    const [showDropdown, setShowDropdown] = useState(false);
    const [compressing, setCompressing] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const [staffQuery, setStaffQuery] = useState(transaction.staff?.name ?? '');
    const [staffResults, setStaffResults] = useState<Staff[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(transaction.staff);
    const [showStaffDropdown, setShowStaffDropdown] = useState(false);
    const staffDebounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const [deletedPhotoIds, setDeletedPhotoIds] = useState<number[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [displayAmount, setDisplayAmount] = useState(new Intl.NumberFormat('id-ID').format(transaction.amount));
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, put, processing, errors } = useForm<{
        customer_id: string;
        staff_id: string;
        period_id: string;
        amount: string;
        notes: string;
        receipt_photos: File[];
        delete_photo_ids: number[];
    }>({
        customer_id: String(transaction.customer.id),
        staff_id: transaction.staff ? String(transaction.staff.id) : '',
        period_id: transaction.period ? String(transaction.period.id) : '',
        amount: String(transaction.amount),
        notes: transaction.notes || '',
        receipt_photos: [],
        delete_photo_ids: [],
    });

    const remainingExisting = transaction.photos.length - deletedPhotoIds.length;
    const totalPhotos = remainingExisting + data.receipt_photos.length;

    const searchCustomers = useCallback((keyword: string) => {
        if (keyword.length < 2) {
            setResults([]);
            setShowDropdown(false);
            return;
        }
        fetch(route('admin.api.customers.search') + '?q=' + encodeURIComponent(keyword))
            .then((res) => res.json())
            .then((data) => {
                setResults(data);
                setShowDropdown(data.length > 0);
            });
    }, []);

    useEffect(() => {
        if (selected && query === selected.name) return;
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
        fetch(route('admin.api.staff.search') + '?q=' + encodeURIComponent(keyword))
            .then((res) => res.json())
            .then((data) => {
                setStaffResults(data);
                setShowStaffDropdown(data.length > 0);
            });
    }, []);

    useEffect(() => {
        if (selectedStaff && staffQuery === selectedStaff.name) return;
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

    function toggleDeletePhoto(photoId: number) {
        setDeletedPhotoIds((prev) => {
            const next = prev.includes(photoId) ? prev.filter((id) => id !== photoId) : [...prev, photoId];
            setData('delete_photo_ids', next);
            return next;
        });
    }

    async function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
        const newFiles = Array.from(e.target.files ?? []);
        const remaining = MAX_PHOTOS - totalPhotos;
        const toProcess = newFiles.slice(0, Math.max(0, remaining));
        if (fileInputRef.current) fileInputRef.current.value = '';

        setCompressing(true);
        const compressed = await Promise.all(toProcess.map((f) => compressImage(f)));
        setCompressing(false);

        const files = [...data.receipt_photos, ...compressed];
        setData('receipt_photos', files);
        setPreviews(files.map((file) => URL.createObjectURL(file)));
    }

    function removeNewPhoto(index: number) {
        const files = data.receipt_photos.filter((_, i) => i !== index);
        setData('receipt_photos', files);
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    }

    function submit(e: FormEvent) {
        e.preventDefault();
        if (compressing) return;
        put(route('admin.transaksi.update', transaction.id), { forceFormData: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Transaksi" />
            <div className="max-w-4xl space-y-6 p-6 font-sans">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Edit Transaksi</h1>
                        <p className="mt-1 text-sm text-slate-500">Ubah detail transaksi customer, termasuk foto struk.</p>
                    </div>
                    <Button
                        variant="outline"
                        className="flex items-center gap-1.5 border-slate-200 transition-colors hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
                        asChild
                    >
                        <Link href={route('admin.transaksi.index')}>
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden border border-slate-200/50 bg-white/70 p-6 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/60">
                    <form onSubmit={submit} className="max-w-2xl space-y-6">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 dark:border-zinc-800/80">
                            <div className="bg-mayang-500/10 text-mayang-600 dark:bg-mayang-500/20 dark:text-mayang-400 flex h-10 w-10 items-center justify-center">
                                <PencilLine className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Detail Transaksi</h3>
                                <p className="text-xs text-slate-500">Ubah customer, kasir, periode, nominal, catatan, atau foto struk.</p>
                            </div>
                        </div>

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
                            <Label htmlFor="period_id" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Periode
                            </Label>
                            <select
                                id="period_id"
                                value={data.period_id}
                                onChange={(e) => setData('period_id', e.target.value)}
                                className="focus-visible:ring-mayang-500/20 focus-visible:border-mayang-500 block w-full border border-slate-200 bg-white/60 px-4 py-3 text-sm transition-all duration-300 focus-visible:ring-4 focus-visible:outline-none dark:border-zinc-800/80 dark:bg-zinc-950/40 dark:text-white"
                            >
                                <option value="">Pilih periode...</option>
                                {periods.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.period_id} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Nominal Belanja (Rp)
                            </Label>
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
                                className="focus-visible:ring-mayang-500/20 focus-visible:border-mayang-500 border-slate-200 bg-white/60 py-5.5 transition-all duration-300 focus-visible:ring-4 dark:border-zinc-800/80 dark:bg-zinc-950/40"
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
                                className="focus-visible:ring-mayang-500/20 focus-visible:border-mayang-500 flex min-h-[80px] w-full border border-slate-200 bg-white/60 px-3 py-2 text-sm transition-all duration-300 focus-visible:ring-4 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800/80 dark:bg-zinc-950/40 dark:text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Foto Struk (maks {MAX_PHOTOS} foto)
                            </Label>

                            {transaction.photos.length > 0 && (
                                <div className="flex flex-wrap gap-3">
                                    {transaction.photos.map((photo, index) => {
                                        const url = route('admin.transaksi.receipt-photo', [transaction.id, photo.id]);
                                        const marked = deletedPhotoIds.includes(photo.id);
                                        return (
                                            <div key={photo.id} className="relative inline-block">
                                                <img
                                                    src={url}
                                                    alt={`Foto struk ${index + 1}`}
                                                    className={`h-32 w-32 border border-slate-200 object-cover shadow-sm dark:border-zinc-800 ${marked ? 'opacity-30' : ''}`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => toggleDeletePhoto(photo.id)}
                                                    className={`absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full text-white shadow-sm transition-colors ${marked ? 'bg-slate-500 hover:bg-slate-600' : 'bg-rose-500 hover:bg-rose-600'}`}
                                                    title={marked ? 'Batal hapus' : 'Hapus foto ini'}
                                                >
                                                    <X className="size-3.5" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {totalPhotos < MAX_PHOTOS && (
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
                                                alt={`Foto baru ${index + 1}`}
                                                className="h-32 w-32 border border-slate-200 object-cover shadow-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeNewPhoto(index)}
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
                                {compressing ? 'Mengompres foto...' : processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
