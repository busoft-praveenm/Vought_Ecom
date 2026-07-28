import React from "react";
import { cookies } from "next/headers";
import { Package, ArrowLeft, CheckCircle2, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/button";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    redirect('/login');
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/orders`, {
    headers: {
      "Cookie": `access_token=${token}`
    },
    cache: 'no-store'
  });

  if (!res.ok) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Error loading orders</h2>
        <Link href="/dashboard" className="text-primary hover:underline">
          Go back to dashboard
        </Link>
      </div>
    );
  }

  const orders = await res.json();

  if (orders.length === 0) {
    return (
      <div className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center h-full w-full">
        <div className="bg-muted/30 p-8 rounded-full mb-6">
          <Package className="w-16 h-16 text-muted-foreground/50" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No Orders Found</h2>
        <p className="text-muted-foreground mb-8 text-center max-w-sm">
          You haven't placed any orders yet. Start shopping!
        </p>
        <Link href="/dashboard/products">
          <Button size="lg" className="px-8">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
      <div className="flex items-center mb-8">
        <Link href="/dashboard/products" className="mr-4 p-2 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold">Your Orders</h1>
      </div>

      <div className="space-y-6">
        {orders.map((order: any) => (
          <div key={order.id} className="bg-card border border-border/50 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-muted/30 p-4 border-b border-border/50 flex flex-wrap justify-between items-center gap-4">
              <div className="flex gap-6">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Order Placed</p>
                  <p className="text-sm font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Total</p>
                  <p className="text-sm font-semibold">
                    {order.items && order.items.length > 0 ? (order.items[0].product.currency === 'INR' ? '₹' : '$') : '₹'}
                    {Number(order.total).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Order #</p>
                  <p className="text-sm font-semibold">VGT-{order.id.toString().padStart(6, '0')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {order.status === 'PAID' && <span className="flex items-center text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full"><CheckCircle2 className="w-4 h-4 mr-1"/> Paid</span>}
                {order.status === 'PENDING' && <span className="flex items-center text-sm font-medium text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full"><Clock className="w-4 h-4 mr-1"/> Pending</span>}
                {order.status === 'FAILED' && <span className="flex items-center text-sm font-medium text-red-600 bg-red-100 px-3 py-1 rounded-full"><XCircle className="w-4 h-4 mr-1"/> Failed</span>}
              </div>
            </div>
            
            <div className="p-6">
              {order.user?.profile && (
                <div className="mb-6 pb-6 border-b border-border/50">
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">Customer Details</h3>
                  <p className="text-sm font-semibold">{order.user.profile.firstName} {order.user.profile.lastName}</p>
                  <p className="text-sm">{order.user.email}</p>
                </div>
              )}
              <h3 className="font-semibold text-lg mb-4">Items in Order</h3>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      {item.product.imageUrl ? (
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Package className="w-6 h-6 text-muted-foreground/30" /></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Link href={`/dashboard/products/${item.product.id}`} className="font-semibold hover:text-primary transition-colors line-clamp-1">
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium mt-1">
                        {item.product.currency === 'INR' ? '₹' : '$'}
                        {Number(item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
