"use server";

import { cookies } from "next/headers";

export async function getProductsAction(page: number = 1, limit: number = 10) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3001";
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    
    const res = await fetch(`${backendUrl}/products?page=${page}&limit=${limit}`, {
      headers: {
        ...(token ? { "Cookie": `access_token=${token}` } : {}),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return { results: [], total: 0 };
  }
}

export async function getRandomProductsAction(limit: number = 5) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3001";
    const res = await fetch(`${backendUrl}/products/random?limit=${limit}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch random products");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching random products:", error);
    return [];
  }
}
