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

export async function addReview(productId: number, rating: number, reviewText: string) {
  const res = await fetchWithAuth('/reviews', {
    method: 'POST',
    body: JSON.stringify({ productId, rating, reviewText })
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Failed to add review:', errorText);
    throw new Error('Failed to add review');
  }

  revalidatePath('/dashboard/products/[id]', 'page');
}
