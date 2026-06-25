export default function AppLogo() {
    return (
        <>
            <div className="from-mayang-500 to-mayang-400 shadow-mayang-500/20 flex aspect-square size-8 items-center justify-center rounded-xl bg-gradient-to-tr shadow-md">
                <img src="/MayangCollection_Logo Icon_White.png" alt="Mayang Logo" className="size-5 object-contain" />
            </div>
            <div className="ml-2 grid flex-1 text-left font-sans text-sm">
                <span className="mb-0.5 truncate leading-none font-bold text-slate-900 dark:text-white">
                    Mayang <span className="text-mayang-500 font-black">Top Spender</span>
                </span>
            </div>
        </>
    );
}
