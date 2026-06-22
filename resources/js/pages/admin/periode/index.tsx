import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Period {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    deleted_at: string | null;
}

interface Props {
    periods: Period[];
}

const formatDate = (date: string) => new Date(date).toLocaleDateString('id-ID');

export default function PeriodeIndex({ periods }: Props) {
    const { flash } = usePage<any>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Periode', href: '/admin/periode' },
    ];

    const handleActivate = (id: number) => {
        if (confirm('Apakah Anda yakin ingin mengaktifkan periode ini?')) {
            router.put(route('admin.periode.activate', id));
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus periode ini?')) {
            router.delete(route('admin.periode.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Periode" />
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Kelola Periode</h1>
                    <Button asChild>
                        <Link href={route('admin.periode.create')}>Tambah Periode</Link>
                    </Button>
                </div>

                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 p-4 text-green-800 dark:text-green-200 text-sm">
                        {flash.success}
                    </div>
                )}

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="text-left py-3 px-4 font-semibold">Nama</th>
                                <th className="text-left py-3 px-4 font-semibold">Tanggal Mulai</th>
                                <th className="text-left py-3 px-4 font-semibold">Tanggal Selesai</th>
                                <th className="text-left py-3 px-4 font-semibold">Status</th>
                                <th className="text-left py-3 px-4 font-semibold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {periods.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-6 text-center text-muted-foreground">
                                        Belum ada periode.
                                    </td>
                                </tr>
                            ) : (
                                periods.map((period) => (
                                    <tr key={period.id} className="border-b last:border-0">
                                        <td className="py-3 px-4">{period.name}</td>
                                        <td className="py-3 px-4">{formatDate(period.start_date)}</td>
                                        <td className="py-3 px-4">{formatDate(period.end_date)}</td>
                                        <td className="py-3 px-4">
                                            {period.is_active ? (
                                                <Badge>Aktif</Badge>
                                            ) : (
                                                <Badge variant="secondary">Tidak Aktif</Badge>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={route('admin.periode.edit', period.id)}>Edit</Link>
                                                </Button>
                                                {!period.is_active && (
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => handleActivate(period.id)}
                                                    >
                                                        Aktifkan
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(period.id)}
                                                >
                                                    Hapus
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
