import PublicFooter from '@/components/public-footer';
import PublicNavbar from '@/components/public-navbar';
import { Head } from '@inertiajs/react';
import { Gift, Plane, Trophy } from 'lucide-react';

interface Reward {
    id: number;
    rank_start: number;
    rank_end: number;
    title: string;
    description: string | null;
}

interface Entry {
    ranking: number;
    name: string;
    total_spending: number;
}

interface MyRank {
    ranking: number | null;
    name: string;
    total_spending: number;
}

interface LeaderboardProps {
    period: { name: string; start_date: string; end_date: string } | null;
    leaderboard: Entry[];
    rewards: Reward[];
    myRank: MyRank | null;
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Coin system: 1 Coin = Rp 5 belanja. Raw rupiah stays in the DB; only the
// displayed value is divided by 5.
function formatCoin(amount: number): string {
    return new Intl.NumberFormat('id-ID').format(Math.floor(amount / 5)) + ' Coin';
}

function rankLabel(r: Reward): string {
    return r.rank_start === r.rank_end ? `Peringkat ${r.rank_start}` : `Peringkat ${r.rank_start}-${r.rank_end}`;
}

function rankNumberClass(ranking: number): string {
    if (ranking === 1) return 'text-gold-500';
    if (ranking === 2) return 'text-slate-400';
    if (ranking === 3) return 'text-orange-700/70';
    return 'text-slate-300';
}

function EntryRow({ entry }: { entry: Entry }) {
    return (
        <div className="flex items-center gap-5 px-5 py-4 transition-colors hover:bg-slate-50/80 sm:px-6">
            <div className={`font-display w-10 shrink-0 text-right text-2xl font-bold ${rankNumberClass(entry.ranking)}`}>{entry.ranking}</div>
            <span className={`flex-1 truncate font-semibold ${entry.ranking <= 3 ? 'text-slate-900' : 'text-slate-700'}`}>{entry.name}</span>
            <span className="text-mayang-600 shrink-0 text-sm font-bold tracking-wide">{formatCoin(entry.total_spending)}</span>
        </div>
    );
}

export default function Leaderboard({ period, leaderboard, rewards, myRank }: LeaderboardProps) {
    // Map each reward bracket to its entries; collect entries not covered by any bracket.
    const grouped = rewards
        .map((reward) => ({
            reward,
            entries: leaderboard.filter((e) => e.ranking >= reward.rank_start && e.ranking <= reward.rank_end),
        }))
        .filter((g) => g.entries.length > 0);

    const coveredRanks = new Set(grouped.flatMap((g) => g.entries.map((e) => e.ranking)));
    const others = leaderboard.filter((e) => !coveredRanks.has(e.ranking));

    return (
        <>
            <Head title="Leaderboard" />
            <div className="selection:bg-mayang-500 relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-white font-sans text-slate-900 selection:text-white">
                <PublicNavbar current="leaderboard" />

                <div className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-4 pt-36 pb-20 sm:px-6 lg:px-8">
                    <div className="mb-10 text-center">
                        <p className="mb-3 text-xs font-bold tracking-[0.3em] text-slate-400 uppercase">Mayang Top Spender</p>
                        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                            Papan <span className="text-mayang-500 italic">Peringkat</span>
                        </h1>
                        {period && (
                            <div className="mx-auto mt-8 inline-flex flex-col items-center border border-slate-200 bg-white px-8 py-4">
                                <span className="font-display text-xl font-bold text-slate-900">{period.name}</span>
                                <span className="mt-1 text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
                                    {formatDate(period.start_date)} &mdash; {formatDate(period.end_date)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Kartu status login */}
                    {period && myRank && (
                        <div className="bg-mayang-900 mb-10 flex items-center justify-between gap-4 px-6 py-5 text-white">
                            <div className="flex items-center gap-5">
                                <div className="flex flex-col items-center justify-center border border-white/20 px-4 py-2">
                                    <span className="text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase">Peringkatmu</span>
                                    <span className="font-display text-3xl font-bold">{myRank.ranking ?? '—'}</span>
                                </div>
                                <div>
                                    <p className="text-lg font-bold">{myRank.name}</p>
                                    <p className="text-sm text-white/70">
                                        {myRank.ranking ? 'Pertahankan posisimu, terus belanja!' : 'Belum ada transaksi di periode ini.'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase">Total Coin</span>
                                <span className="text-mayang-300 text-xl font-bold">{formatCoin(myRank.total_spending)}</span>
                            </div>
                        </div>
                    )}

                    {!period ? (
                        <div className="mt-8 border border-slate-200 bg-white p-12 text-center">
                            <div className="mx-auto mb-4 flex size-16 items-center justify-center bg-slate-100 text-slate-400">
                                <Trophy className="size-8" />
                            </div>
                            <h3 className="font-display text-xl font-bold text-slate-900">Belum Ada Kompetisi</h3>
                            <p className="mt-2 text-slate-500">Saat ini belum ada periode kompetisi yang aktif.</p>
                        </div>
                    ) : leaderboard.length === 0 ? (
                        <div className="mt-8 border border-slate-200 bg-white p-12 text-center">
                            <div className="mx-auto mb-4 flex size-16 items-center justify-center bg-slate-100 text-slate-400">
                                <Trophy className="size-8" />
                            </div>
                            <h3 className="font-display text-xl font-bold text-slate-900">Belum Ada Transaksi</h3>
                            <p className="mt-2 text-slate-500">Jadilah yang pertama untuk memimpin leaderboard di periode ini!</p>
                        </div>
                    ) : grouped.length > 0 ? (
                        <div className="space-y-10">
                            {grouped.map(({ reward, entries }) => {
                                const isUmroh = reward.rank_start === 1 && reward.rank_end === 1;
                                return (
                                    <div key={reward.id}>
                                        <div className="mb-3 flex items-center gap-2 px-1">
                                            {isUmroh ? <Plane className="text-gold-500 size-4" /> : <Gift className="text-mayang-500 size-4" />}
                                            <h2 className="text-xs font-bold tracking-[0.2em] text-slate-600 uppercase">
                                                {rankLabel(reward)}: <span className={isUmroh ? 'text-gold-600' : 'text-mayang-600'}>{reward.title}</span>
                                                {isUmroh && (
                                                    <span className="bg-gold-500 ml-2 px-2 py-0.5 text-[10px] font-bold tracking-[0.2em] text-white uppercase">
                                                        Grand Prize
                                                    </span>
                                                )}
                                            </h2>
                                        </div>
                                        <div
                                            className={`divide-y overflow-hidden border ${
                                                isUmroh
                                                    ? 'divide-gold-400/20 border-gold-500 border-l-4 bg-white'
                                                    : 'divide-slate-100 border-slate-200 bg-white'
                                            }`}
                                        >
                                            {entries.map((entry) => (
                                                <EntryRow key={entry.ranking} entry={entry} />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}

                            {others.length > 0 && (
                                <div>
                                    <div className="mb-3 px-1">
                                        <h2 className="text-xs font-bold tracking-[0.2em] text-slate-600 uppercase">Peringkat Lainnya</h2>
                                    </div>
                                    <div className="divide-y divide-slate-100 overflow-hidden border border-slate-200 bg-white">
                                        {others.map((entry) => (
                                            <EntryRow key={entry.ranking} entry={entry} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 overflow-hidden border border-slate-200 bg-white">
                            {leaderboard.map((entry) => (
                                <EntryRow key={entry.ranking} entry={entry} />
                            ))}
                        </div>
                    )}

                    {period && leaderboard.length > 0 && (
                        <p className="mt-8 text-center text-xs font-medium tracking-[0.15em] text-slate-400 uppercase">
                            Menampilkan Top 50 spender periode aktif
                        </p>
                    )}
                </div>

                <PublicFooter />
            </div>
        </>
    );
}
