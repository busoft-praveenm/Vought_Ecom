import { Topbar } from "@/components/layout/topbar";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { AutoLogout } from "@/components/auth/auto-logout";
import Link from "next/link";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  let exp: number | undefined;
  if (token) {
    try {
      const payloadPart = token.split('.')[1];
      if (payloadPart) {
        const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const payload = JSON.parse(jsonPayload);
        exp = payload.exp;
      }
    } catch (e) {
      console.error("Failed to parse token for AutoLogout", e);
    }
  }

  let cartCount = 0;
  let isAdmin = false;
  try {
    if (token) {
      const headers = { "Cookie": `access_token=${token}` };
      const [cartRes, authRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/cart`, {
          headers,
          cache: 'no-store'
        }),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/me`, {
          headers,
          cache: 'no-store'
        })
      ]);
      
      if (cartRes.ok) {
        const data = await cartRes.json();
        cartCount = data?.items?.length || 0; 
      }
      
      if (authRes.ok) {
        const authData = await authRes.json();
        if (authData?.user?.role?.name === 'admin') {
          isAdmin = true;
        }
      }
    }
  } catch (err) {
    console.error("Failed to fetch cart or auth in layout", err);
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <AutoLogout exp={exp} />
      {/* Sidebar Navigation */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r border-zinc-800 bg-[#494F55] sm:flex">
        <div className="flex h-16 items-center border-b border-zinc-800 px-6 relative">
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
            Vought India
          </span>
        </div>
        <SidebarNav isAdmin={isAdmin} />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col sm:gap-4 sm:pl-64 w-full">
        {/* We use the custom Topbar component */}
        <Topbar cartCount={cartCount} />

        <main className="flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
