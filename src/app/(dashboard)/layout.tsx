import { AppSideBar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full overflow-hidden bg-[#0b0e14]">
        {/* Ambient glow like login */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-purple-600/20 blur-[180px]" />
          <div className="absolute bottom-[-30%] right-[-20%] h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[180px]" />
        </div>

        <AppSideBar />

        <SidebarInset className="relative z-10 flex-1 overflow-y-auto bg-transparent px-8 py-6 text-white">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
