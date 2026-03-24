import { AppSideBar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full overflow-hidden bg-[#030305]">
        {/* Abstract Animated Background Engine */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          {/* Subtle static noise overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
          
          {/* Giant moving celestial orbs */}
          <div className="absolute -top-[30%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-violet-600/10 blur-[140px] animate-pulse [animation-duration:8s] [animation-timing-function:ease-in-out]" />
          <div className="absolute top-[20%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-blue-600/10 blur-[130px] animate-pulse [animation-duration:12s] [animation-timing-function:ease-in-out]" />
          <div className="absolute -bottom-[40%] left-[20%] w-[80vw] h-[80vw] rounded-full bg-indigo-500/10 blur-[150px] animate-pulse [animation-duration:15s] [animation-timing-function:ease-in-out]" />
        </div>

        <div className="relative z-20">
          <AppSideBar />
        </div>

        <SidebarInset className="relative z-10 flex-1 flex flex-col min-w-0 bg-transparent h-screen overflow-y-auto">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
