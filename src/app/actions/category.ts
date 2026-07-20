"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getCategoriesAction(page: number = 1, limit: number = 10) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3001";
    const res = await fetch(`${backendUrl}/categories?page=${page}&limit=${limit}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { data: [], total: 0 };
  }
}

export async function createCategoryAction(data: { name: string; description?: string }) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3001";
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const res = await fetch(`${backendUrl}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Cookie: `access_token=${token}` } : {}),
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { success: false, error: errorData.message || "Failed to create category" };
    }

    revalidatePath("/dashboard/admin/categories");
    return { success: true, data: await res.json() };
  } catch (error: any) {
    console.error("Error creating category:", error);
    return { success: false, error: error.message || "Internal server error" };
  }
}
