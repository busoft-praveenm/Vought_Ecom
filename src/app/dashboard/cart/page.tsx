import React from "react";
import { cookies } from "next/headers";
import { ShoppingCart, Trash2, ArrowLeft, Package, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/button";
import { updateCartItemQuantity, removeCartItem } from "@/app/actions/cart";
import CheckoutButton from "./checkout-button";

type CartData = {
  cart: {
    id: number;
    createdAt: string;
  };
  items: Array<{
    id: number;
    quantity: number;
    product: {
      id: number;
      name: string;
      price: number;
      stock: number;
      imageUrl: string;
      currency: string;
    }
  }>;
};

export default async function CartPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/cart`, {
    headers: {
      ...(token ? { "Cookie": `access_token=${token}` } : {})
    },
    cache: 'no-store'
  });

  if (!res.ok) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-4">Error loading cart</h2>
        <Link href="/dashboard/products" className="text-primary hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const data: CartData = await res.json();
  const items = data?.items || [];
  
  const subtotal = items.reduce((acc, item) => acc + (item.quantity * Number(item.product.price)), 0);
  const currencySymbol = items.length > 0 ? (items[0].product.currency === 'INR' ? '₹' : '$') : '₹';

  if (items.length === 0) {
    return (
      <div className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center h-full w-full">
        <div className="bg-muted/30 p-8 rounded-full mb-6">
          <ShoppingCart className="w-16 h-16 text-muted-foreground/50" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
        <p className="text-muted-foreground mb-8 text-center max-w-sm">
          Looks like you haven't added anything to your cart yet. Let's get you back to shopping.
        </p>
        <Link href="/dashboard/products">
          <Button size="lg" className="px-8">Continue Shopping</Button>
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
        <h1 className="text-3xl font-bold">Shopping Cart ({items.length} items)</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-card border border-border/50 rounded-xl shadow-sm">
              <div className="w-full sm:w-32 h-32 bg-muted/30 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                {item.product.imageUrl ? (
                  <img src={item.product.imageUrl} alt={item.product.name} className="object-cover w-full h-full" />
                ) : (
                  <Package className="w-10 h-10 text-muted-foreground/30" />
                )}
              </div>
              
              <div className="flex flex-col flex-grow justify-between py-1">
                <div className="flex justify-between items-start gap-4">
                  <Link href={`/dashboard/products/${item.product.id}`}>
                    <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  <span className="font-bold whitespace-nowrap">
                    {item.product.currency === 'INR' ? '₹' : '$'}
                    {Number(item.product.price).toFixed(2)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-border rounded-md overflow-hidden bg-background">
                    <form action={updateCartItemQuantity.bind(null, item.id, item.quantity - 1)}>
                      <button 
                        type="submit"
                        className="p-2 hover:bg-muted transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </form>
                    <span className="px-4 font-medium text-sm">{item.quantity}</span>
                    <form action={updateCartItemQuantity.bind(null, item.id, item.quantity + 1)}>
                      <button 
                        type="submit"
                        className="p-2 hover:bg-muted transition-colors disabled:opacity-50"
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                  
                  <form action={removeCartItem.bind(null, item.id)}>
                    <Button type="submit" variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-card border border-border/50 rounded-xl p-6 h-fit sticky top-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6 pb-4 border-b border-border/50">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{currencySymbol}{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax (Estimated)</span>
              <span>{currencySymbol}0.00</span>
            </div>
          </div>
          
          <div className="flex justify-between font-bold text-lg mb-8 pt-4 border-t border-border/50">
            <span>Total</span>
            <span className="text-primary">{currencySymbol}{subtotal.toFixed(2)}</span>
          </div>
          
          <CheckoutButton disabled={items.length === 0} />
        </div>
        
      </div>
    </div>
  );
}
