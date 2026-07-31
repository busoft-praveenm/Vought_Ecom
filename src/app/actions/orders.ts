'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createRazorpayOrder() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    throw new Error('Not authenticated');
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/orders/create`, {
    method: 'POST',
    headers: {
      'Cookie': `access_token=${token}`,
    },
    cache: 'no-store'
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create order');
  }

  return res.json();
}

export async function verifyRazorpayPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    throw new Error('Not authenticated');
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/orders/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `access_token=${token}`,
    },
    body: JSON.stringify({
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    }),
    cache: 'no-store'
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to verify payment');
  }

  revalidatePath('/dashboard/cart');
  revalidatePath('/dashboard/orders');
  
  return res.json();
}

export async function getOrders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    throw new Error('Not authenticated');
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/orders`, {
    method: 'GET',
    headers: {
      'Cookie': `access_token=${token}`,
    },
    cache: 'no-store'
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch orders');
  }

  return res.json();
}

export async function updateOrderStatusAction(orderId: number, formData: FormData) {
  const status = formData.get('status') as string;
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    throw new Error('Not authenticated');
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `access_token=${token}`,
    },
    body: JSON.stringify({ status }),
    cache: 'no-store'
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update order status');
  }

  revalidatePath('/dashboard/orders');
  return res.json();
}
