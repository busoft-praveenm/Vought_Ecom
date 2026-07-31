import React from "react";
import { cookies } from "next/headers";
import { Package, ArrowLeft, CheckCircle2, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { redirect } from "next/navigation";
import { updateOrderStatusAction } from "@/app/actions/orders";

const STAGES = [
  { id: 'ORDER_PLACED', label: 'Order Placed' },
  { id: 'PACKAGING_DONE', label: 'Packaging' },
  { id: 'ASSIGNED_DELIVERY_AGENT', label: 'Agent Assigned' },
  { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { id: 'DELIVERED', label: 'Delivered' }
];

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
  const isAdmin = orders.some((o: any) => !!o.user);

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
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Est. Delivery</p>
                  <p className="text-sm font-semibold">
                    {order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {order.status === 'PENDING' && <span className="flex items-center text-sm font-medium text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full"><Clock className="w-4 h-4 mr-1"/> Pending</span>}
                {order.status === 'FAILED' && <span className="flex items-center text-sm font-medium text-red-600 bg-red-100 px-3 py-1 rounded-full"><XCircle className="w-4 h-4 mr-1"/> Failed</span>}
              </div>
            </div>
            
            {/* Stepper UI */}
            {!['PENDING', 'FAILED'].includes(order.status) && (
              <div className="px-8 py-8 border-b border-border/50 bg-muted/10">
                <div className="relative">
                  <div className="absolute left-0 top-4 -translate-y-1/2 w-full h-1 bg-muted rounded-full"></div>
                  
                  {(() => {
                    const currentStageIndex = STAGES.findIndex(s => s.id === order.status);
                    return (
                      <>
                        <div 
                          className="absolute left-0 top-4 -translate-y-1/2 h-1 bg-primary rounded-full transition-all duration-500" 
                          style={{ width: `${(Math.max(0, currentStageIndex) / (STAGES.length - 1)) * 100}%` }}
                        ></div>
                        <div className="relative flex justify-between">
                          {STAGES.map((stage, idx) => {
                            const isCompleted = currentStageIndex >= idx;
                            return (
                              <div key={stage.id} className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-3 bg-background z-10 transition-colors duration-500 ${
                                  isCompleted ? 'border-primary bg-primary text-primary-foreground' : 'border-muted text-muted-foreground'
                                }`}>
                                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />}
                                </div>
                                <span className={`text-xs font-bold text-center w-24 leading-tight ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {stage.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
            
            <div className="p-6">
              {isAdmin && order.user?.profile && (
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

              {isAdmin && (
                <form action={updateOrderStatusAction.bind(null, order.id)} className="mt-8 flex items-center gap-4 border-t border-border/50 pt-6">
                  <label className="text-sm font-semibold whitespace-nowrap">Admin Action: Update Status</label>
                  <Select key={order.status} name="status" defaultValue={order.status}>
                    <SelectTrigger className="w-64 bg-background">
                      <SelectValue placeholder="Select status">
                        {order.status === 'PENDING' ? 'Pending (Payment Incomplete)' : 
                         order.status === 'FAILED' ? 'Failed' : 
                         STAGES.find(s => s.id === order.status)?.label || order.status}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending (Payment Incomplete)</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                      {STAGES.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="submit" size="default">Update Status</Button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
