import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { FormEventHandler } from 'react';

interface Props {
    cashier: {
        id: number;
        name: string;
        email: string;
    };
}

export default function KasirEdit({ cashier }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Kasir', href: '/admin/kasir' },
        { title: 'Edit', href: `/admin/kasir/${cashier.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: cashier.name,
        email: cashier.email,
        password: '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.kasir.update', cashier.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Kasir" />
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Edit Kasir</h1>
                    <Button variant="outline" asChild>
                        <Link href={route('admin.kasir.index')}>Kembali</Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Kosongkan jika tidak ingin mengubah"
                        />
                        <InputError message={errors.password} />
                        <p className="text-xs text-muted-foreground">
                            Kosongkan jika tidak ingin mengubah password.
                        </p>
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
