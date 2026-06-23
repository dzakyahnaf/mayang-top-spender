import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="bg-gradient-to-tr from-mayang-500 to-mayang-400 text-white flex aspect-square size-8 items-center justify-center rounded-xl shadow-md shadow-mayang-500/20">
                <AppLogoIcon className="size-5 fill-current" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm font-sans">
                <span className="mb-0.5 truncate leading-none font-bold text-slate-900 dark:text-white">
                    Mayang <span className="text-mayang-500 font-black">Modest</span>
                </span>
            </div>
        </>
    );
}
