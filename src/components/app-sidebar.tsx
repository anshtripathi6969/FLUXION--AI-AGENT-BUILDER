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
  "bg-gradient-to-b from-[#0b0b12] via-[#0f0f1a] to-[#090911]";

/* ================= COMPONENT ================= */

export const AppSideBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();


  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className={`${SIDEBAR_BG} border-r border-white/10 overflow-hidden`}
    >
      {/* ================= HEADER ================= */}
      <SidebarHeader className={`${SIDEBAR_BG} border-b border-white/5 px-4 py-8 flex items-center gap-3`}>
        <Link href="/workflows" className="flex items-center gap-4 group">
          <div className="relative shrink-0 transition-transform duration-500 group-hover:scale-110">
            <Image src="/logos/logo2.svg" alt="Fluxion" width={32} height={32} className="relative z-10" />
            <span className="absolute inset-0 rounded-full blur-xl bg-primary/40 group-hover:bg-primary/60 transition-colors duration-500" />
            <span className="absolute -inset-1 rounded-full blur-md bg-primary/20 animate-pulse" />
          </div>
 
          {!isCollapsed && (
            <span className="text-2xl font-bold tracking-tight text-white fluxion-glow whitespace-nowrap">
              Fluxion
            </span>
          )}
        </Link>
      </SidebarHeader>

      {/* ================= CONTENT ================= */}
      <SidebarContent className={`${SIDEBAR_BG} backdrop-blur-xl`}>
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
                        h-12 px-4 gap-4 relative group
                        text-slate-400 font-medium
                        hover:bg-white/[0.03] hover:text-white
                        data-[active=true]:bg-primary/10
                        data-[active=true]:text-primary
                        transition-all duration-300 rounded-xl
                      "
                    >
                      <Link href={item.url} className="flex items-center w-full">
                        {/* Active Indicator */}
                        <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full scale-y-0 group-data-[active=true]:scale-y-100 transition-transform duration-300 origin-center" />
                        
                        <item.icon className="size-4.5 shrink-0 group-hover:scale-110 transition-transform duration-300 group-data-[active=true]:text-primary" />
                        {!isCollapsed && (
                          <span className="tracking-tight ml-4">{item.title}</span>
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
