"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function saveProductAction(payload: any, productId?: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const isEdit = !!productId;
  const url = isEdit ? `${backendUrl}/products/${productId}` : `${backendUrl}/products`;
  const method = isEdit ? "PATCH" : "POST";

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Cookie": `access_token=${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errorMessage = "Failed to save product";
    try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorMessage;
    } catch(e) {}
    return { success: false, error: errorMessage };
  }

  revalidatePath("/dashboard/admin/products");
  revalidatePath("/dashboard/products");
  return { success: true };
}

export async function updateProductStatusAction(productId: string, data: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) return { success: false, error: "Not authenticated" };

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const res = await fetch(`${backendUrl}/products/${productId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `access_token=${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) return { success: false, error: "Failed to update product" };

  revalidatePath("/dashboard/admin/products");
  revalidatePath("/dashboard/products");
  return { success: true };
}

export async function deleteProductAction(productId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) return { success: false, error: "Not authenticated" };

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const res = await fetch(`${backendUrl}/products/${productId}`, {
    method: "DELETE",
    headers: {
      "Cookie": `access_token=${token}`,
    },
  });

  if (!res.ok) return { success: false, error: "Failed to delete product" };

  revalidatePath("/dashboard/admin/products");
  revalidatePath("/dashboard/products");
  return { success: true };
}
