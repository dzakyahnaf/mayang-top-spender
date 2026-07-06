import PublicFooter from '@/components/public-footer';
import PublicNavbar from '@/components/public-navbar';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

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

const HEADER_BG = '/Leaderboard-bg.jpg';

const HEXAGON = 'polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)';

const medalStyles: Record<number, { ring: string; face: string }> = {
    1: { ring: 'bg-gold-400', face: 'bg-gold-500' },
    2: { ring: 'bg-slate-300', face: 'bg-slate-400' },
    3: { ring: 'bg-orange-700/70', face: 'bg-orange-800/80' },
};

function RankNumber({ ranking }: { ranking: number }) {
    const medal = medalStyles[ranking];

    if (medal) {
        return (
            <div className="relative flex size-11 shrink-0 items-center justify-center">
                <div className={`absolute inset-0 ${medal.ring}`} style={{ clipPath: HEXAGON }} aria-hidden="true" />
                <div className={`absolute inset-[3px] ${medal.face}`} style={{ clipPath: HEXAGON }} aria-hidden="true" />
                <span className="font-display relative text-lg font-bold text-white">{ranking}</span>
            </div>
        );
    }

    return <div className="font-display flex size-11 shrink-0 items-center justify-center text-xl font-bold text-slate-900">{ranking}</div>;
}

function EntryRow({ entry }: { entry: Entry }) {
    return (
        <div className="hover:bg-mayang-100/70 flex items-center gap-5 px-5 py-4 transition-colors sm:px-6">
            <RankNumber ranking={entry.ranking} />
            <span className={`flex-1 truncate font-semibold ${entry.ranking <= 3 ? 'text-slate-900' : 'text-slate-700'}`}>{entry.name}</span>
            <span className="text-mayang-700 shrink-0 text-sm font-bold tracking-wide">{formatCoin(entry.total_spending)}</span>
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

                {/* Header band dengan foto + overlay gelap */}
                <div className="relative w-full overflow-hidden pt-36 pb-16 text-center text-white">
                    <img src={HEADER_BG} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
                    <div className="bg-mayang-900/85 absolute inset-0" aria-hidden="true" />

                    <div className="relative z-10">
                        <p className="mb-3 text-xs font-bold tracking-[0.3em] text-white/60 uppercase">Mayang Top Spender</p>
                        <h1 className="font-display px-4 text-4xl font-bold tracking-tight uppercase sm:text-6xl">
                            Papan <span className="text-mayang-300">Peringkat</span>
                        </h1>
                        {period && (
                            <div className="mt-6 inline-flex flex-col items-center gap-1">
                                <span className="font-display text-lg font-bold">{period.name}</span>
                                <span className="text-xs font-bold tracking-[0.2em] text-white/60 uppercase">
                                    {formatDate(period.start_date)} &mdash; {formatDate(period.end_date)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-4 pt-10 pb-20 sm:px-6 lg:px-8">
                    {!period ? (
                        <div className="border border-slate-200 bg-white p-12 text-center">
                            <h3 className="font-display text-xl font-bold text-slate-900">Belum Ada Kompetisi</h3>
                            <p className="mt-2 text-slate-500">Saat ini belum ada periode kompetisi yang aktif.</p>
                        </div>
                    ) : (
                        <>
                            {/* Callout grand prize */}
                            <div className="border-gold-500 flex flex-wrap items-center justify-center gap-3 border-l-4 bg-slate-50 px-6 py-4 text-center">
                                <p className="text-sm font-semibold text-slate-700">
                                    Peringkat 1 di akhir periode membawa pulang <strong className="text-gold-600">Paket Umrah</strong> — plus 1
                                    pemenang undian beruntung lainnya.
                                </p>
                            </div>

                            {/* Kartu status login */}
                            {myRank && (
                                <div className="bg-mayang-900 mt-8 flex items-center justify-between gap-4 px-6 py-5 text-white">
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

                            {leaderboard.length === 0 ? (
                                <div className="mt-8 border border-slate-200 bg-white p-12 text-center">
                                    <h3 className="font-display text-xl font-bold text-slate-900">Belum Ada Transaksi</h3>
                                    <p className="mt-2 text-slate-500">Jadilah yang pertama untuk memimpin leaderboard di periode ini!</p>
                                </div>
                            ) : (
                                <div className="mt-10 space-y-12">
                                    {grouped.map(({ reward, entries }) => {
                                        const isUmroh = reward.rank_start === 1 && reward.rank_end === 1;
                                        return (
                                            <div key={reward.id}>
                                                <div
                                                    className={`mb-4 flex items-center gap-3 border-l-4 py-1 pl-4 ${
                                                        isUmroh ? 'border-gold-500' : 'border-mayang-500'
                                                    }`}
                                                >
                                                    <div>
                                                        <p className="text-[11px] font-bold tracking-[0.25em] text-slate-400 uppercase">
                                                            {rankLabel(reward)}
                                                        </p>
                                                        <h2
                                                            className={`font-display text-xl font-bold sm:text-2xl ${
                                                                isUmroh ? 'text-gold-600' : 'text-slate-900'
                                                            }`}
                                                        >
                                                            {reward.title}
                                                        </h2>
                                                    </div>
                                                    {isUmroh && (
                                                        <span className="bg-gold-500 ml-auto hidden px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-white uppercase sm:inline-block">
                                                            Grand Prize
                                                        </span>
                                                    )}
                                                </div>
                                                <div
                                                    className={`bg-mayang-50 divide-mayang-200/50 divide-y overflow-hidden border ${
                                                        isUmroh ? 'border-gold-500 border-2' : 'border-mayang-200'
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
                                            <div className="border-mayang-500 mb-4 flex items-center gap-3 border-l-4 py-1 pl-4">
                                                <h2 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">Peringkat Lainnya</h2>
                                            </div>
                                            <div className="bg-mayang-50 border-mayang-200 divide-mayang-200/50 divide-y overflow-hidden border">
                                                {others.map((entry) => (
                                                    <EntryRow key={entry.ranking} entry={entry} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {leaderboard.length > 0 && (
                                <p className="mt-8 text-center text-xs font-medium tracking-[0.15em] text-slate-400 uppercase">
                                    
                                </p>
                            )}

                            {/* CTA ikut program */}
                            <div className="bg-mayang-900 mt-14 px-6 py-12 text-center text-white sm:px-12">
                                <p className="mb-3 text-xs font-bold tracking-[0.3em] text-white/60 uppercase">Ingin Namamu di Sini?</p>
                                <h2 className="font-display text-3xl font-bold sm:text-4xl">
                                    Belanja Hari Ini, <span className="text-mayang-300 italic">Naik Peringkat.</span>
                                </h2>
                                <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70">
                                    Setiap belanjamu di seluruh outlet Mayang Modest Wear tercatat sebagai Coin. Daftar sekarang dan mulai kumpulkan
                                    peringkatmu.
                                </p>
                                <div className="mt-8 flex flex-col flex-wrap justify-center gap-4 sm:flex-row">
                                    <Link
                                        href={route('register')}
                                        className="group bg-mayang-500 hover:bg-mayang-400 flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold tracking-[0.15em] text-white uppercase transition-all"
                                    >
                                        Daftar Sekarang
                                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                    <Link
                                        href={route('daftar-hadiah')}
                                        className="flex items-center justify-center gap-2 border border-white/40 bg-white/10 px-8 py-4 text-sm font-bold tracking-[0.15em] text-white uppercase backdrop-blur-sm transition-all hover:border-white hover:bg-white/20"
                                    >
                                        Lihat Daftar Hadiah
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <PublicFooter />
            </div>
        </>
    );
}
