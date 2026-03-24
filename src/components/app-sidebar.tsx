"use client";

import {
  FolderOpenIcon,
  HistoryIcon,
  KeyIcon,
  LogOutIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

/* ================= MENU ================= */

const menuItems = [
  {
    title: "MAIN",
    items: [
      { title: "Workflows", icon: FolderOpenIcon, url: "/workflows" },
      { title: "Credentials", icon: KeyIcon, url: "/credentials" },
      { title: "Executions", icon: HistoryIcon, url: "/executions" },
    ],
  },
];

/* ================= BACKGROUND ================= */

const SIDEBAR_BG =
  "bg-transparent";

/* ================= COMPONENT ================= */

export const AppSideBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();


  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      variant="floating"
      className="mt-2 mb-2 [&>div[data-sidebar=sidebar]]:!bg-[#030305]/40 [&>div[data-sidebar=sidebar]]:!backdrop-blur-3xl [&>div[data-sidebar=sidebar]]:!border-white/5 [&>div[data-sidebar=sidebar]]:shadow-[0_0_50px_-10px_rgba(0,0,0,0.5)] [&>div[data-sidebar=sidebar]]:!rounded-3xl"
    >
      {/* ================= HEADER ================= */}
      <SidebarHeader className={cn("border-b border-white/5 flex items-center h-20", isCollapsed ? "justify-center px-0 py-4" : "px-6 py-6")}>
        <Link href="/workflows" className={cn("flex items-center group", isCollapsed ? "justify-center" : "gap-4")}>
          <div className="relative shrink-0 transition-transform duration-500 group-hover:scale-110">
            <Image src="/logos/logo2.svg" alt="Fluxion" width={30} height={30} className="relative z-10" />
            <span className="absolute inset-0 rounded-full blur-xl bg-blue-500/40 group-hover:bg-violet-500/60 transition-colors duration-500" />
            <span className="absolute -inset-1 rounded-full blur-md bg-violet-400/20 animate-pulse" />
          </div>
 
          {!isCollapsed && (
            <span className="text-2xl font-bold tracking-tight text-white fluxion-glow whitespace-nowrap">
              Fluxion
            </span>
          )}
        </Link>
      </SidebarHeader>

      {/* ================= CONTENT ================= */}
      <SidebarContent className="backdrop-blur-none bg-transparent">
        {menuItems.map((group) => (
          <SidebarGroup key={group.title} className="py-4">
            {!isCollapsed && (
              <div className="px-4 pb-3 text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
                {group.title}
              </div>
            )}

            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={pathname.startsWith(item.url)}
                      className="
                        h-12 px-4 gap-4 relative group overflow-hidden
                        text-slate-400 font-medium
                        hover:bg-white/[0.03] hover:text-white
                        data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-600/10 data-[active=true]:to-violet-600/10
                        data-[active=true]:text-white
                        transition-all duration-300 rounded-xl
                      "
                    >
                      <Link href={item.url} className="flex items-center w-full relative z-10">
                        {/* Shimmer Overlay */}
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                        
                        {/* Active Indicator */}
                        <div className="absolute left-0 w-1.5 h-6 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-r-full scale-y-0 group-data-[active=true]:scale-y-100 group-data-[active=true]:shadow-[0_0_15px_rgba(99,102,241,0.8)] transition-all duration-500 origin-center" />
                        
                        <item.icon className="size-5 shrink-0 group-hover:scale-110 transition-transform duration-300 group-data-[active=true]:text-blue-400 group-data-[active=true]:drop-shadow-[0_0_12px_rgba(96,165,250,0.8)]" />
                        {!isCollapsed && (
                          <span className="tracking-wide ml-4 text-[15px]">{item.title}</span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* ================= FOOTER ================= */}
      <SidebarFooter className={`${SIDEBAR_BG} border-t border-white/5 px-2 py-6`}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-12 gap-4 px-4 text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 rounded-xl group"
              onClick={() =>
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => router.push("/login"),
                  },
                })
              }
            >
              <LogOutIcon className="size-4.5 group-hover:rotate-12 transition-transform duration-300" />
              {!isCollapsed && <span className="font-medium tracking-tight">Sign Out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* ================= LOCAL STYLES ================= */}
      <style jsx>{`
        .fluxion-glow {
          text-shadow: 0 0 14px rgba(168, 85, 247, 0.6);
          animation: glowPulse 6s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0% {
            text-shadow: 0 0 12px rgba(168, 85, 247, 0.55);
          }
          50% {
            text-shadow: 0 0 20px rgba(168, 85, 247, 0.75);
          }
          100% {
            text-shadow: 0 0 12px rgba(168, 85, 247, 0.55);
          }
        }
      `}</style>
    </Sidebar>
  );
};
