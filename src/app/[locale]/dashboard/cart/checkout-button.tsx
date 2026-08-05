'use client';

import { useState } from 'react';
import { Button } from '@/components/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createRazorpayOrder, verifyRazorpayPayment } from '@/app/actions/orders';
import Script from 'next/script';

export default function CheckoutButton({ disabled, userEmail, userPhone, userName }: { disabled: boolean, userEmail?: string, userPhone?: string, userName?: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    try {
      setLoading(true);
      
      // 1. Create order on backend
      const orderData = await createRazorpayOrder();
      
      // 2. Open Razorpay Checkout modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Vought E-commerce",
        description: "Test Transaction",
        order_id: orderData.razorpayOrderId,
        handler: async function (response: any) {
          try {
            // 3. Verify payment on backend
            await verifyRazorpayPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            toast.success("Payment successful!");
            router.push('/dashboard/orders');
          } catch (error: any) {
            toast.error(error.message || "Payment verification failed");
          }
        },
        prefill: {
          name: userName || "Test User",
          email: userEmail || "test@example.com",
          contact: userPhone || "9999999999"
        },
        theme: {
          color: "#3b82f6" // Primary color
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast.error(response.error.description || "Payment failed");
      });
      rzp.open();
    } catch (error: any) {
      if (error.message === 'ADDRESS_REQUIRED') {
        toast.error("Please fill in your billing and delivery address before placing an order.", { duration: 5000 });
        router.push('/dashboard/profile');
      } else {
        toast.error(error.message || "Failed to initiate checkout");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Button size="lg" className="w-full" disabled={disabled || loading} onClick={handleCheckout}>
        {loading ? "Processing..." : "Proceed to Checkout"}
      </Button>
    </>
  );
}
