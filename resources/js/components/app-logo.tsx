export default function AppLogo() {
    return (
        <>
            <div className="bg-mayang-500 flex aspect-square size-8 items-center justify-center">
                <img src="/MayangCollection_Logo Icon_White.png" alt="Mayang Logo" className="size-5 object-contain" />
            </div>
            <div className="ml-2 grid flex-1 text-left font-sans text-sm leading-none">
                <span className="font-display truncate text-sm font-bold text-slate-900 dark:text-white">MAYANG</span>
                <span className="text-mayang-600 dark:text-mayang-400 mt-0.5 truncate text-[9px] font-bold tracking-[0.2em] uppercase">
                    Top Spender
                </span>
            </div>
        </>
    );
}
