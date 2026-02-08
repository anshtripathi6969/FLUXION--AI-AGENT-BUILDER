"use client";

import {
  CreditCardIcon,
  FolderOpenIcon,
  HistoryIcon,
  KeyIcon,
  LogOutIcon,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscription";

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
  const { hasActiveSubscription, isLoading } = useHasActiveSubscription();

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className={`${SIDEBAR_BG} border-r border-white/10 overflow-hidden`}
    >
      {/* ================= HEADER ================= */}
      <SidebarHeader className={`${SIDEBAR_BG} px-4 py-5 flex items-center gap-3`}>
        <Link href="/workflows" className="flex items-center gap-3">
          <div className="relative shrink-0">
            <Image src="/logos/logo2.svg" alt="Fluxion" width={26} height={26} />
            <span className="absolute inset-0 rounded-full blur-md bg-purple-600/40" />
          </div>

          {!isCollapsed && (
            <span className="text-xl font-semibold tracking-wide text-purple-400 fluxion-glow whitespace-nowrap">
              Fluxion
            </span>
          )}
        </Link>
      </SidebarHeader>

      {/* ================= CONTENT ================= */}
      <SidebarContent className={`${SIDEBAR_BG} backdrop-blur-xl`}>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            {!isCollapsed && (
              <div className="px-4 pb-2 text-xs font-semibold tracking-widest text-purple-400/70">
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
                        h-11 px-4 gap-4
                        text-purple-100
                        hover:bg-purple-500/15
                        data-[active=true]:bg-purple-500/25
                        data-[active=true]:text-purple-300
                        transition-all
                      "
                    >
                      <Link href={item.url}>
                        <item.icon className="size-4 shrink-0" />
                        {!isCollapsed && <span>{item.title}</span>}
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
      <SidebarFooter className={`${SIDEBAR_BG} px-2 pb-4`}>
        <SidebarMenu>
          {!hasActiveSubscription && !isLoading && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="h-10 gap-4 px-4 hover:bg-purple-500/15"
                  onClick={() => authClient.checkout({ slug: "pro" })}
                >
                  <StarIcon className="h-4 w-4" />
                  {!isCollapsed && <span>Upgrade to Pro</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton className="h-10 gap-4 px-4 hover:bg-purple-500/15">
                  <CreditCardIcon className="h-4 w-4" />
                  {!isCollapsed && <span>Billing Portal</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-10 gap-4 px-4 text-red-400 hover:bg-red-500/10"
              onClick={() =>
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => router.push("/login"),
                  },
                })
              }
            >
              <LogOutIcon className="h-4 w-4" />
              {!isCollapsed && <span>Sign Out</span>}
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
