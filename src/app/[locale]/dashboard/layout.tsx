import { Topbar } from "@/components/layout/topbar";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { AutoLogout } from "@/components/auth/auto-logout";
import Link from "next/link";
import { cookies } from "next/headers";
import { DashboardClientLayout } from "@/components/layout/client-layout";

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
        let base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
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
    <>
      <AutoLogout exp={exp} />
      <DashboardClientLayout
        topbar={<Topbar cartCount={cartCount} />}
        sidebar={<SidebarNav isAdmin={isAdmin} />}
      >
        <main className="flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8">
          {children}
        </main>
      </DashboardClientLayout>
    </>
  );
}
