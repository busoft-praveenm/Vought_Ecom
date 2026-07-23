"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getBrandsAction(page: number = 1, limit: number = 50) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3001";
    const res = await fetch(`${backendUrl}/brands?page=${page}&limit=${limit}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch brands");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching brands:", error);
    return { results: [], pagination: { totalPages: 1, total: 0 } };
  }
}

export async function getBrandsAdminAction(page: number = 1, limit: number = 50) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3001";
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const res = await fetch(`${backendUrl}/brands/admin?page=${page}&limit=${limit}`, {
      cache: "no-store",
      headers: {
        ...(token ? { Cookie: `access_token=${token}` } : {}),
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch admin brands");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching admin brands:", error);
    return { results: [], pagination: { totalPages: 1, total: 0 } };
  }
}

export async function createBrandAction(data: { name: string; description?: string; imageUrl?: string }) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3001";
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const res = await fetch(`${backendUrl}/brands`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Cookie: `access_token=${token}` } : {}),
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { success: false, error: errorData.message || "Failed to create brand" };
    }

    revalidatePath("/dashboard/admin/brands");
    return { success: true, data: await res.json() };
  } catch (error: any) {
    console.error("Error creating brand:", error);
    return { success: false, error: error.message || "Internal server error" };
  }
}

export async function updateBrandAction(id: number, data: { name?: string; description?: string; imageUrl?: string; isActive?: boolean }) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3001";
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const res = await fetch(`${backendUrl}/brands/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Cookie: `access_token=${token}` } : {}),
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { success: false, error: errorData.message || "Failed to update brand" };
    }

    revalidatePath("/dashboard/admin/brands");
    return { success: true, data: await res.json() };
  } catch (error: any) {
    console.error("Error updating brand:", error);
    return { success: false, error: error.message || "Internal server error" };
  }
}

export async function deleteBrandAction(id: number) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3001";
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const res = await fetch(`${backendUrl}/brands/${id}`, {
      method: "DELETE",
      headers: {
        ...(token ? { Cookie: `access_token=${token}` } : {}),
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { success: false, error: errorData.message || "Failed to delete brand" };
    }

    revalidatePath("/dashboard/admin/brands");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting brand:", error);
    return { success: false, error: error.message || "Internal server error" };
  }
}
