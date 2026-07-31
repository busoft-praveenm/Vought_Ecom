import React from "react";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import { cookies } from "next/headers";
import { getRandomCategoriesAction } from "@/app/actions/category";
import { getRandomBrandsAction } from "@/app/actions/brand";
import { getRandomProductsAction } from "@/app/actions/product";
import { CategoryMasonry } from "./category-masonry";
import InfiniteMenu from "@/components/InfiniteMenu";
import Carousel from "@/components/Carousel";
export const metadata = {
  title: "Dashboard - Vought Ecom",
  description: "Overview of your e-commerce platform.",
};

async function getIsAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) return false;
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/me`, {
      headers: { "Cookie": `access_token=${token}` },
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      return data?.user?.role?.name === 'admin';
    }
  } catch (err) {}
  return false;
}

function AdminOverview() {
  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors delay-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors delay-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors delay-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 since last hour</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-2 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Card className="col-span-1 h-[400px] flex items-center justify-center bg-card/50 border-dashed border-2">
          <span className="text-muted-foreground">Revenue Chart Placeholder</span>
        </Card>
        <Card className="col-span-1 h-[400px] flex items-center justify-center bg-card/50 border-dashed border-2">
          <span className="text-muted-foreground">Recent Activity Placeholder</span>
        </Card>
      </div>
    </div>
  );
}

async function UserLanding() {
  const t = await getTranslations("Dashboard");
  const [categories, brands, products] = await Promise.all([
    getRandomCategoriesAction(20),
    getRandomBrandsAction(15),
    getRandomProductsAction(15)
  ]);

  const brandItems = brands.map((b: any) => ({
    image: b.imageUrl || 'https://picsum.photos/400/400?grayscale',
    title: b.name,
    description: b.description || 'Premium Brand',
    link: `/dashboard/products?brand=${b.id}`
  }));

  const productItems = products.map((p: any) => ({
    id: p.id,
    title: p.name,
    description: p.description || 'Amazing product',
    imageUrl: p.imageUrl || 'https://picsum.photos/300/300?grayscale',
    link: `/dashboard/products/${p.id}`
  }));

  return (
    <div className="w-full animate-in fade-in zoom-in-95 duration-700 space-y-24 pb-20">
      
      {/* Brands Section */}
      {brandItems.length > 0 && (
        <section>
          <div className="text-center mb-10 max-w-6xl mx-auto">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4">{t('FeaturedBrands')}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('FeaturedBrandsDesc')}
            </p>
          </div>
          <div style={{ height: '600px', position: 'relative' }}>
            <InfiniteMenu items={brandItems} scale={1.2} />
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section>
        <div className="text-center mb-10 max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold tracking-tight mb-4">{t('DiscoverCategories')}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('DiscoverCategoriesDesc')}
          </p>
        </div>
        <CategoryMasonry categories={categories} />
      </section>

      {/* Products Section */}
      {productItems.length > 0 && (
        <section>
          <div className="text-center mb-10 max-w-6xl mx-auto">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4">{t('TrendingProducts')}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('TrendingProductsDesc')}
            </p>
          </div>
          <div className="flex justify-center" style={{ height: '700px', position: 'relative' }}>
            <Carousel
              items={productItems}
              baseWidth={1000}
              autoplay
              autoplayDelay={2000}
              pauseOnHover={true}
              loop={true}
              round={false}
            />
          </div>
        </section>
      )}
    </div>
  );
}

export default async function DashboardPage() {
  const isAdmin = await getIsAdmin();

  return (
    <div className="w-full">
      {isAdmin ? <AdminOverview /> : <UserLanding />}
    </div>
  );
}
