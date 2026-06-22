import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { FormEventHandler } from 'react';

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
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Edit Periode</h1>
                    <Button variant="outline" asChild>
                        <Link href={route('admin.periode.index')}>Kembali</Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Periode</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="start_date">Tanggal Mulai</Label>
                        <Input
                            id="start_date"
                            type="date"
                            value={data.start_date}
                            onChange={(e) => setData('start_date', e.target.value)}
                        />
                        <InputError message={errors.start_date} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="end_date">Tanggal Selesai</Label>
                        <Input
                            id="end_date"
                            type="date"
                            value={data.end_date}
                            onChange={(e) => setData('end_date', e.target.value)}
                        />
                        <InputError message={errors.end_date} />
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
