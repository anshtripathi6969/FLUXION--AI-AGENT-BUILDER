import { SidebarTrigger } from "./ui/sidebar";

export const AppHeader = () => {
    return (
        <header className="sticky top-0 z-50 flex h-20 shrink-0 items-center justify-between gap-2 px-8 mb-4 border-b border-white/[0.05] bg-[#030305]/60 backdrop-blur-3xl shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="text-slate-400 hover:text-white transition-colors" />
            </div>
            {/* Ambient decorative top border glow */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        </header>
  );
};