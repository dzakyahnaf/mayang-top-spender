import PublicFooter from '@/components/public-footer';
import PublicNavbar from '@/components/public-navbar';
import { Head } from '@inertiajs/react';
import { ScrollText } from 'lucide-react';

const sections = [
    {
        title: '1. Keikutsertaan',
        items: [
            'Program Mayang Top Spender terbuka untuk seluruh pelanggan Mayang Modest Wear yang telah terdaftar sebagai member.',
            'Pendaftaran member dapat dilakukan secara mandiri melalui website atau dibantu oleh kasir di toko.',
            'Setiap peserta wajib mendaftar dengan data yang benar (nama, email, dan nomor HP yang aktif dan unik).',
        ],
    },
    {
        title: '2. Perhitungan Coin & Peringkat',
        items: [
            'Total belanja dihitung berdasarkan nominal transaksi (Rupiah) yang dicatat oleh kasir selama periode kompetisi yang aktif.',
            'Hanya transaksi yang dilakukan selama periode program berlangsung yang dihitung.',
            'Peringkat ditentukan dari total belanja tertinggi ke terendah dan diperbarui secara real-time.',
            'Hanya ada satu periode kompetisi yang aktif dalam satu waktu.',
        ],
    },
    {
        title: '3. Hadiah',
        items: [
            'Hadiah diberikan kepada peraih peringkat sesuai dengan Daftar Hadiah yang berlaku pada periode tersebut.',
            'Hadiah tidak dapat ditukar dengan uang tunai kecuali ditentukan lain oleh Mayang Modest Wear.',
            'Pemenang akan dihubungi melalui kontak yang terdaftar setelah periode berakhir.',
            'Penyerahan hadiah diatur secara terpisah (offline) oleh tim Mayang Modest Wear.',
        ],
    },
    {
        title: '4. Transaksi & Pengembalian (Refund)',
        items: [
            'Transaksi yang dibatalkan atau dikembalikan (refund) akan mengurangi total belanja peserta pada periode tersebut.',
            'Kasir dapat memperbaiki transaksi pada hari yang sama; admin dapat menyesuaikan transaksi bila diperlukan untuk menjaga akurasi data.',
        ],
    },
    {
        title: '5. Privasi Data',
        items: [
            'Dengan mengikuti program ini, peserta menyetujui penggunaan data (nama, email, nomor HP, dan riwayat belanja) untuk keperluan program Top Spender.',
            'Nama dan total belanja peserta dapat ditampilkan di papan peringkat (leaderboard) publik.',
        ],
    },
    {
        title: '6. Ketentuan Lain',
        items: [
            'Mayang Modest Wear berhak mengubah syarat, ketentuan, periode, maupun daftar hadiah sewaktu-waktu.',
            'Segala bentuk kecurangan dapat mengakibatkan diskualifikasi peserta.',
            'Keputusan Mayang Modest Wear bersifat final dan tidak dapat diganggu gugat.',
        ],
    },
];

export default function Syarat() {
    return (
        <>
            <Head title="Syarat & Ketentuan" />
            <div className="selection:bg-mayang-500 relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-white font-sans text-slate-900 selection:text-white">
                <PublicNavbar current="syarat" />

                <div className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-4 pt-36 pb-20 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <div className="bg-mayang-500/10 text-mayang-600 mx-auto mb-6 flex size-16 items-center justify-center">
                            <ScrollText className="size-8" />
                        </div>
                        <p className="mb-3 text-xs font-bold tracking-[0.3em] text-slate-400 uppercase">Mayang Top Spender</p>
                        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                            Syarat & <span className="text-mayang-500 italic">Ketentuan</span>
                        </h1>
                        <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600">Ketentuan keikutsertaan program Mayang Top Spender.</p>
                    </div>

                    <div className="divide-y divide-slate-200 border-y border-slate-200">
                        {sections.map((section) => (
                            <div key={section.title} className="bg-white py-8">
                                <h2 className="font-display mb-5 text-xl font-bold text-slate-900">{section.title}</h2>
                                <ul className="space-y-3">
                                    {section.items.map((item, i) => (
                                        <li key={i} className="flex gap-4 text-sm leading-relaxed text-slate-600">
                                            <span className="bg-mayang-500 mt-2 size-1.5 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <PublicFooter />
            </div>
        </>
    );
}
