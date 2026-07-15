'use server';

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      ...(token ? { "Cookie": `access_token=${token}` } : {})
    },
  });
}

export async function addToCart(productId: number, quantity: number = 1) {
  const res = await fetchWithAuth('/cart/items', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity })
  });

  if (!res.ok) {
    console.error('Failed to add to cart:', await res.text());
    // Optionally return an error message to display on the UI
  }

  revalidatePath('/dashboard/products/[id]', 'page');
  revalidatePath('/dashboard/cart');
  revalidatePath('/dashboard', 'layout'); // Update the topbar badge
}

export async function updateCartItemQuantity(itemId: number, quantity: number) {
  const res = await fetchWithAuth(`/cart/items/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity })
  });

  if (!res.ok) {
    console.error('Failed to update cart item:', await res.text());
  }

  revalidatePath('/dashboard/cart');
}

export async function removeCartItem(itemId: number) {
  const res = await fetchWithAuth(`/cart/items/${itemId}`, {
    method: 'DELETE'
  });

  if (!res.ok) {
    console.error('Failed to remove cart item:', await res.text());
  }

  revalidatePath('/dashboard/cart');
  revalidatePath('/dashboard', 'layout');
}
