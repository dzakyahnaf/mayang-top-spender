import PublicFooter from '@/components/public-footer';
import PublicNavbar from '@/components/public-navbar';
import { Head } from '@inertiajs/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useState } from 'react';

const faqs = [
    {
        q: 'Apa itu Mayang Top Spender?',
        a: 'Mayang Top Spender adalah program loyalitas Mayang Modest Wear. Setiap belanjamu dicatat dan diakumulasi selama satu periode kompetisi. Semakin tinggi total belanjamu, semakin tinggi peringkatmu di papan peringkat (leaderboard) dan semakin besar peluang memenangkan hadiah.',
    },
    {
        q: 'Bagaimana cara ikut program ini?',
        a: 'Daftar sebagai member terlebih dahulu — bisa mandiri lewat halaman Daftar Sekarang di website, atau langsung dibantu oleh kasir saat kamu berbelanja di toko. Cukup isi nama, email, dan nomor HP.',
    },
    {
        q: 'Bagaimana transaksi belanja saya tercatat?',
        a: 'Setiap kali kamu berbelanja di toko Mayang Modest Wear, kasir akan mencatat nominal belanjamu ke dalam sistem dan mengaitkannya ke periode kompetisi yang sedang aktif. Total belanjamu akan otomatis terakumulasi.',
    },
    {
        q: 'Bagaimana peringkat dihitung?',
        a: 'Peringkat dihitung dari total nominal belanja (Rupiah) selama periode aktif, diurutkan dari yang tertinggi. Peringkat di leaderboard diperbarui secara real-time setiap ada transaksi baru.',
    },
    {
        q: 'Bagaimana cara mengecek total belanja saya?',
        a: 'Login ke akun member-mu, lalu buka halaman "Cek Belanjaanku" untuk melihat riwayat transaksi dan total belanjamu pada periode aktif. Peringkatmu juga akan muncul di halaman Leaderboard saat kamu login.',
    },
    {
        q: 'Apakah nama saya ditampilkan di papan peringkat publik?',
        a: 'Ya. Leaderboard bersifat publik dan menampilkan peringkat, nama, serta total belanja peserta. Hanya peringkat 1-100 yang ditampilkan, namun kamu tetap bisa melihat posisimu sendiri saat login.',
    },
    {
        q: 'Bagaimana sistem periode kompetisi bekerja?',
        a: 'Hanya ada satu periode aktif dalam satu waktu. Saat periode baru diaktifkan, perhitungan leaderboard dimulai ulang untuk periode tersebut. Pastikan kamu mengecek nama dan tanggal periode yang sedang berjalan di halaman Leaderboard.',
    },
    {
        q: 'Bagaimana cara hadiah dibagikan?',
        a: 'Hadiah dibagikan kepada peraih peringkat sesuai Daftar Hadiah setelah periode berakhir. Pemenang akan dihubungi oleh tim Mayang Modest Wear melalui kontak yang terdaftar. Penyerahan hadiah diatur secara offline.',
    },
    {
        q: 'Apa yang harus saya lakukan jika ada kesalahan pencatatan transaksi?',
        a: 'Segera informasikan kepada kasir di toko atau hubungi admin Mayang Modest Wear. Kasir dapat memperbaiki transaksi pada hari yang sama, dan admin dapat menyesuaikan transaksi bila diperlukan.',
    },
];

export default function Faq() {
    const [open, setOpen] = useState<number | null>(0);

    return (
        <>
            <Head title="FAQ" />
            <div className="from-mayang-50 to-mayang-100/40 selection:bg-mayang-500 relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-gradient-to-br via-slate-50 font-sans text-slate-900 selection:text-white">
                <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-[600px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(circle_at_top,_rgba(27,174,185,0.08)_0%,_rgba(27,174,185,0)_70%)]" />

                <PublicNavbar current="faq" />

                <div className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-4 pt-32 pb-20 sm:px-6 lg:px-8">
                    <div className="mb-10 text-center">
                        <div className="bg-mayang-500/10 text-mayang-600 mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl">
                            <HelpCircle className="size-8" />
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                            Pertanyaan <span className="text-mayang-500">Umum</span>
                        </h1>
                        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
                            Hal-hal yang sering ditanyakan seputar program Mayang Top Spender.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <div key={index} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <button
                                    type="button"
                                    onClick={() => setOpen(open === index ? null : index)}
                                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-50"
                                >
                                    <span className="font-bold text-slate-900">{faq.q}</span>
                                    <ChevronDown
                                        className={`size-5 shrink-0 text-slate-400 transition-transform duration-300 ${open === index ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {open === index && (
                                    <div className="border-t border-slate-100 px-6 py-5 text-sm leading-relaxed text-slate-600">{faq.a}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <PublicFooter />
            </div>
        </>
    );
}
