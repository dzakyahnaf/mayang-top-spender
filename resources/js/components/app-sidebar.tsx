import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ClipboardList, LayoutGrid, Trophy, UserPlus, Users, CalendarDays, History } from 'lucide-react';
import AppLogo from './app-logo';

const adminNavItems: NavItem[] = [
    { title: 'Dashboard', url: '/admin/dashboard', icon: LayoutGrid },
    { title: 'Periode', url: '/admin/periode', icon: CalendarDays },
    { title: 'Kasir', url: '/admin/kasir', icon: Users },
    { title: 'Transaksi', url: '/admin/transaksi', icon: ClipboardList },
    { title: 'Customer', url: '/admin/customer', icon: UserPlus },
];

const kasirNavItems: NavItem[] = [
    { title: 'Input Transaksi', url: '/kasir/transaksi', icon: ClipboardList },
    { title: 'History Transaksi', url: '/kasir/transaksi/history', icon: History },
    { title: 'Daftarkan Customer', url: '/kasir/customer/create', icon: UserPlus },
];

const footerNavItems: NavItem[] = [
    { title: 'Leaderboard', url: '/leaderboard', icon: Trophy },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const navItems = auth.user?.role === 'admin' ? adminNavItems : kasirNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
