import PublicFooter from '@/components/public-footer';
import PublicNavbar from '@/components/public-navbar';
import { Head, Link } from '@inertiajs/react';
import { Gift, Plane, Trophy } from 'lucide-react';

interface Reward {
    id: number;
    rank_start: number;
    rank_end: number;
    title: string;
    description: string | null;
}

interface Props {
    rewards: Reward[];
}

const rankLabel = (r: Reward) => (r.rank_start === r.rank_end ? `Peringkat ${r.rank_start}` : `Peringkat ${r.rank_start}-${r.rank_end}`);

export default function DaftarHadiah({ rewards }: Props) {
    return (
        <>
            <Head title="Daftar Hadiah" />
            <div className="from-mayang-50 to-mayang-100/70 selection:bg-mayang-500 relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-gradient-to-br via-white font-sans text-slate-900 selection:text-white">
                <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-[600px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(circle_at_top,_rgba(27,174,185,0.16)_0%,_rgba(27,174,185,0)_70%)]" />

                <PublicNavbar current="daftar-hadiah" />

                <div className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-4 pt-32 pb-20 sm:px-6 lg:px-8">
                    <div className="mb-10 text-center">
                        <div className="bg-mayang-500/10 text-mayang-600 mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl">
                            <Gift className="size-8" />
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                            Daftar <span className="text-mayang-500">Hadiah</span>
                        </h1>
                        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
                            Jadilah Top Spender dan menangkan hadiah menarik berdasarkan peringkatmu di akhir periode.
                        </p>
                    </div>

                    {rewards.length === 0 ? (
                        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900">Belum Ada Hadiah</h3>
                            <p className="mt-2 text-slate-500">Daftar hadiah akan segera diumumkan.</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                            {rewards.map((reward, index) => {
                                const isUmroh = reward.rank_start === 1 && reward.rank_end === 1;
                                return (
                                    <div
                                        key={reward.id}
                                        className={`flex items-center gap-4 px-6 py-5 ${index !== 0 ? 'border-t border-slate-100' : ''} ${
                                            isUmroh ? 'bg-gradient-to-r from-amber-50 to-transparent' : ''
                                        }`}
                                    >
                                        <div
                                            className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${
                                                isUmroh ? 'bg-amber-100 text-amber-600' : 'bg-mayang-500/10 text-mayang-600'
                                            }`}
                                        >
                                            {isUmroh ? <Plane className="size-6" /> : <Trophy className="size-6" />}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold tracking-wide text-slate-400 uppercase">{rankLabel(reward)}</span>
                                                {isUmroh && (
                                                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black tracking-wide text-amber-700 uppercase">
                                                        Grand Prize
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`truncate text-lg font-bold ${isUmroh ? 'text-amber-800' : 'text-slate-900'}`}>
                                                {reward.title}
                                            </p>
                                            {reward.description && <p className="truncate text-sm text-slate-500">{reward.description}</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="mt-10 text-center">
                        <Link
                            href={route('leaderboard')}
                            className="bg-mayang-500 hover:bg-mayang-600 inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                        >
                            <Trophy className="size-5" />
                            Lihat Papan Peringkat
                        </Link>
                    </div>
                </div>

                <PublicFooter />
            </div>
        </>
    );
}
