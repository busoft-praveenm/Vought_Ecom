"use client";

import React from "react";
import { Search, Bell, Settings, User, LogOut, ShoppingCart, Menu, Globe } from "lucide-react";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { useRouter, usePathname, Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useSidebar } from "@/components/layout/client-layout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/dropdown-menu";

export const Topbar = ({ cartCount = 0 }: { cartCount?: number }) => {
  const t = useTranslations("Topbar");
  const router = useRouter();
  const pathname = usePathname();
  const { toggle, isOpen } = useSidebar();
  const [lang, setLang] = React.useState('en');

  React.useEffect(() => {
    const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'));
    if (match) {
      setLang(match[2]);
    }
  }, []);

  const changeLanguage = (newLang: string) => {
    setLang(newLang);
    router.replace(pathname, { locale: newLang });
  };

  const handleLogout = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
      await fetch(`${backendUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      // Always force NEXT_LOCALE to 'en' on logout
      document.cookie = "NEXT_LOCALE=en; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT";
      // Redirect to login page in English
      router.replace("/login", { locale: 'en' });
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-800 bg-[#494F55] backdrop-blur-md px-4 sm:px-6 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggle} className="text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50 -ml-2 shrink-0">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
        <div className="flex items-center relative mr-4">
          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes logo-shimmer {
              0% { background-position: 0% 50%; }
              100% { background-position: 200% 50%; }
            }
            .animate-logo-shimmer {
              background: linear-gradient(
                to right,
                #FF9933 0%,
                #FFFFFF 33%,
                #138808 66%,
                #FF9933 100%
              );
              background-size: 200% auto;
              color: transparent;
              -webkit-background-clip: text;
              background-clip: text;
              animation: logo-shimmer 4s linear infinite;
            }
            .dark .animate-logo-shimmer {
              background: linear-gradient(
                to right,
                #FF9933 0%,
                #FFFFFF 33%,
                #138808 66%,
                #FF9933 100%
              );
              background-size: 200% auto;
              color: transparent;
              -webkit-background-clip: text;
              background-clip: text;
            }
          `}} />
          <span className="text-xl font-bold tracking-tight animate-logo-shimmer">
            {t('VoughtIndia')}
          </span>
        </div>
        <form className="hidden sm:flex relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            type="search"
            placeholder={t('SearchPlaceholder')}
            className="w-full appearance-none bg-zinc-900 border-zinc-800 text-zinc-200 placeholder:text-zinc-500 pl-8 shadow-none md:w-2/3 lg:w-[300px] rounded-full transition-all hover:bg-zinc-800 focus:bg-zinc-900 focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700"
          />
        </form>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/dashboard/cart">
          <Button variant="ghost" size="icon" className="relative rounded-full text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-[22px] min-w-[22px] px-1 items-center justify-center rounded-full bg-[#FF9933] text-[12px] font-black text-black shadow-md border border-[#FF9933]">
                {cartCount}
              </span>
            )}
            <span className="sr-only">Cart</span>
          </Button>
        </Link>
        <Button variant="ghost" size="icon" className="rounded-full text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50">
          <Settings className="h-5 w-5" />
          <span className="sr-only">{t('Settings')}</span>
        </Button>

        <div className="ml-2 flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="ghost" size="icon" className="rounded-full text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50 data-[state=open]:bg-zinc-800/50 data-[state=open]:text-zinc-50 cursor-pointer">
                <Globe className="h-5 w-5" />
                <span className="sr-only">{t('Language')}</span>
              </Button>
            } />
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuGroup>
                <DropdownMenuLabel>{t('Language')}</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => changeLanguage('en')} className="cursor-pointer">
                {lang === 'en' ? '✓ English' : 'English'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('ta')} className="cursor-pointer">
                {lang === 'ta' ? '✓ Tamil' : 'Tamil'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="ghost" size="icon" className="rounded-full text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50 data-[state=open]:bg-zinc-800/50 data-[state=open]:text-zinc-50 cursor-pointer">
                <User className="h-5 w-5" />
                <span className="sr-only">{t('Profile')}</span>
              </Button>
            } />
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuLabel>{t('MyAccount')}</DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/dashboard/profile')} className="cursor-pointer">{t('Profile')}</DropdownMenuItem>
              <DropdownMenuItem>{t('Settings')}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t('LogOut')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
