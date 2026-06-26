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

function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID').format(amount);
}

function rankLabel(r: Reward): string {
    return r.rank_start === r.rank_end ? `Peringkat ${r.rank_start}` : `Peringkat ${r.rank_start}-${r.rank_end}`;
}

function medalClass(ranking: number): string {
    if (ranking === 1) return 'bg-amber-100 text-amber-600';
    if (ranking === 2) return 'bg-slate-200 text-slate-600';
    if (ranking === 3) return 'bg-orange-100 text-orange-700';
    return 'bg-slate-50 text-slate-500';
}

function EntryRow({ entry }: { entry: Entry }) {
    return (
        <div className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50/80">
            <div className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-sm ${medalClass(entry.ranking)}`}>
                {entry.ranking}
            </div>
            <span className={`flex-1 truncate font-semibold ${entry.ranking <= 3 ? 'text-slate-900' : 'text-slate-700'}`}>{entry.name}</span>
            <span className="text-mayang-600 shrink-0 font-bold">Rp {formatRupiah(entry.total_spending)}</span>
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
            <div className="from-mayang-50 to-mayang-100/70 selection:bg-mayang-500 relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-gradient-to-br via-white font-sans text-slate-900 selection:text-white">
                <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-[600px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(circle_at_top,_rgba(27,174,185,0.16)_0%,_rgba(27,174,185,0)_70%)]" />

                <PublicNavbar current="leaderboard" />

                <div className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-4 pt-32 pb-20 sm:px-6 lg:px-8">
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                            Top Spender <span className="text-mayang-500">Leaderboard</span>
                        </h1>
                        {period && (
                            <div className="mx-auto mt-6 flex max-w-sm flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
                                <span className="text-lg font-bold text-slate-900">{period.name}</span>
                                <span className="text-sm font-medium text-slate-500">
                                    {formatDate(period.start_date)} &mdash; {formatDate(period.end_date)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Kartu status login */}
                    {period && myRank && (
                        <div className="from-mayang-500 to-mayang-700 mb-8 flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-r px-6 py-5 text-white shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-center justify-center rounded-xl bg-white/15 px-4 py-2">
                                    <span className="text-[10px] font-semibold tracking-wide text-white/70 uppercase">Peringkatmu</span>
                                    <span className="text-2xl font-black">{myRank.ranking ?? '—'}</span>
                                </div>
                                <div>
                                    <p className="text-lg font-bold">{myRank.name}</p>
                                    <p className="text-sm text-white/80">
                                        {myRank.ranking ? 'Pertahankan posisimu, terus belanja!' : 'Belum ada transaksi di periode ini.'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-[10px] font-semibold tracking-wide text-white/70 uppercase">Total Belanja</span>
                                <span className="text-xl font-black">Rp {formatRupiah(myRank.total_spending)}</span>
                            </div>
                        </div>
                    )}

                    {!period ? (
                        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                <Trophy className="size-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Belum Ada Kompetisi</h3>
                            <p className="mt-2 text-slate-500">Saat ini belum ada periode kompetisi yang aktif.</p>
                        </div>
                    ) : leaderboard.length === 0 ? (
                        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                <Trophy className="size-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Belum Ada Transaksi</h3>
                            <p className="mt-2 text-slate-500">Jadilah yang pertama untuk memimpin leaderboard di periode ini!</p>
                        </div>
                    ) : grouped.length > 0 ? (
                        <div className="space-y-8">
                            {grouped.map(({ reward, entries }) => {
                                const isUmroh = reward.rank_start === 1 && reward.rank_end === 1;
                                return (
                                    <div key={reward.id}>
                                        <div className={`mb-3 flex items-center gap-2 px-1 ${isUmroh ? '' : ''}`}>
                                            {isUmroh ? <Plane className="size-4 text-amber-500" /> : <Gift className="text-mayang-500 size-4" />}
                                            <h2 className="text-sm font-bold tracking-wide text-slate-700">
                                                {rankLabel(reward)}:{' '}
                                                <span className={isUmroh ? 'text-amber-600' : 'text-mayang-600'}>{reward.title}</span>
                                                {isUmroh && (
                                                    <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black tracking-wide text-amber-700 uppercase">
                                                        Grand Prize
                                                    </span>
                                                )}
                                            </h2>
                                        </div>
                                        <div
                                            className={`divide-y overflow-hidden rounded-2xl border shadow-sm ${
                                                isUmroh
                                                    ? 'divide-amber-100 border-amber-200 bg-gradient-to-br from-amber-50 to-white'
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
                                    <div className="mb-3 flex items-center gap-2 px-1">
                                        <h2 className="text-sm font-bold tracking-wide text-slate-700">Peringkat Lainnya</h2>
                                    </div>
                                    <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                        {others.map((entry) => (
                                            <EntryRow key={entry.ranking} entry={entry} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            {leaderboard.map((entry) => (
                                <EntryRow key={entry.ranking} entry={entry} />
                            ))}
                        </div>
                    )}

                    {period && leaderboard.length > 0 && (
                        <p className="mt-6 text-center text-xs text-slate-400">Menampilkan Top 50 spender periode aktif.</p>
                    )}
                </div>

                <PublicFooter />
            </div>
        </>
    );
}
