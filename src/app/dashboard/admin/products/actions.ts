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
