import PublicFooter from '@/components/public-footer';
import PublicNavbar from '@/components/public-navbar';
import { Head, Link } from '@inertiajs/react';
import { Plane, Trophy } from 'lucide-react';

const UMROH_IMG = '/hadiah-umroh.webp';
const GOLD_IMG = '/hadiah-emas.webp';
const MICROWAVE_IMG = '/hadiah-microwave.webp';
const PANCI_IMG = '/hadiah-panci.webp';

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
const isGrandPrize = (r: Reward) => r.rank_start === 1 && r.rank_end === 1;

// Overlap check: does this reward's rank range touch the given [from, to] bracket?
const overlaps = (r: Reward, from: number, to: number) => r.rank_start <= to && r.rank_end >= from;

function rewardImage(r: Reward): string | null {
    if (isGrandPrize(r)) return UMROH_IMG;
    if (overlaps(r, 2, 3)) return GOLD_IMG;
    if (overlaps(r, 4, 5)) return MICROWAVE_IMG;
    if (overlaps(r, 6, 7)) return PANCI_IMG;
    return null;
}

export default function DaftarHadiah({ rewards }: Props) {
    const pictured = rewards.filter((r) => rewardImage(r) !== null);
    const unpictured = rewards.filter((r) => rewardImage(r) === null);

    return (
        <>
            <Head title="Daftar Hadiah" />
            <div className="selection:bg-mayang-500 relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-white font-sans text-slate-900 selection:text-white">
                <PublicNavbar current="daftar-hadiah" />

                <div className="relative z-10 mx-auto w-full max-w-4xl flex-1 px-4 pt-36 pb-20 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <p className="mb-3 text-xs font-bold tracking-[0.3em] text-slate-400 uppercase">Mayang Top Spender</p>
                        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                            Daftar <span className="text-mayang-500 italic">Hadiah</span>
                        </h1>
                        <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600">
                            Jadilah Top Spender dan menangkan hadiah menarik berdasarkan peringkatmu di akhir periode.
                        </p>
                    </div>

                    {rewards.length === 0 ? (
                        <div className="mt-8 border border-slate-200 bg-white p-12 text-center">
                            <h3 className="font-display text-xl font-bold text-slate-900">Belum Ada Hadiah</h3>
                            <p className="mt-2 text-slate-500">Daftar hadiah akan segera diumumkan.</p>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {/* Hadiah bergambar, disusun ke bawah dengan gaya seragam */}
                            {pictured.map((reward) => {
                                const grand = isGrandPrize(reward);
                                return (
                                    <div
                                        key={reward.id}
                                        className={`grid overflow-hidden border md:grid-cols-2 ${grand ? 'border-gold-500' : 'border-slate-200'}`}
                                    >
                                        <div className="relative aspect-square w-full">
                                            <img
                                                src={rewardImage(reward)!}
                                                alt={reward.title}
                                                className="absolute inset-0 h-full w-full object-cover"
                                            />
                                            {grand && (
                                                <div className="bg-gold-500 absolute top-0 left-0 px-4 py-2">
                                                    <span className="text-[11px] font-bold tracking-[0.25em] text-white uppercase">Grand Prize</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col justify-center bg-white p-8 sm:p-10">
                                            <div className={`mb-4 flex items-center gap-2 ${grand ? 'text-gold-600' : 'text-mayang-600'}`}>
                                                {grand ? <Plane className="size-5" /> : <Trophy className="size-5" />}
                                                <span className="text-xs font-bold tracking-[0.25em] uppercase">{rankLabel(reward)}</span>
                                            </div>
                                            <h2 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">{reward.title}</h2>
                                            {reward.description && <p className="mt-4 leading-relaxed text-slate-500">{reward.description}</p>}
                                            {grand && (
                                                <div className="mt-6 space-y-2 border-t border-slate-100 pt-5 text-sm text-slate-400">
                                                    <p>Untuk satu peserta dengan total belanja tertinggi di akhir periode.</p>
                                                    <p>
                                                        <strong className="text-slate-600">Bonus:</strong> Ada juga 1 orang beruntung yang
                                                        mendapatkan Paket Umrah melalui undian, terpisah dari peringkat leaderboard.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Hadiah lainnya tanpa foto */}
                            {unpictured.length > 0 && (
                                <div>
                                    {pictured.length > 0 && (
                                        <h3 className="mb-4 text-xs font-bold tracking-[0.25em] text-slate-500 uppercase">Hadiah Lainnya</h3>
                                    )}
                                    <div className="divide-y divide-slate-100 overflow-hidden border border-slate-200 bg-white">
                                        {unpictured.map((reward) => (
                                            <div key={reward.id} className="flex items-center gap-5 px-6 py-5 transition-colors hover:bg-slate-50/80">
                                                <div className="bg-mayang-500/10 text-mayang-600 flex size-12 shrink-0 items-center justify-center">
                                                    <Trophy className="size-6" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <span className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                                                        {rankLabel(reward)}
                                                    </span>
                                                    <p className="truncate text-lg font-bold text-slate-900">{reward.title}</p>
                                                    {reward.description && <p className="truncate text-sm text-slate-500">{reward.description}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-12 text-center">
                        <Link
                            href={route('leaderboard')}
                            className="bg-mayang-500 hover:bg-mayang-600 inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold tracking-[0.15em] text-white uppercase transition-all"
                        >
                            <Trophy className="size-4" />
                            Lihat Papan Peringkat
                        </Link>
                    </div>
                </div>

                <PublicFooter />
            </div>
        </>
    );
}
