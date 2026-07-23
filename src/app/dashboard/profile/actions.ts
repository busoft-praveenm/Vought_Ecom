"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(formData: { 
  firstName: string; 
  lastName: string; 
  mobileNumber: string;
  billingAddress?: string;
  deliveryAddress?: string;
  deliveryLat?: number;
  deliveryLng?: number;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const res = await fetch(`${backendUrl}/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `access_token=${token}`,
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    return { success: false, error: "Failed to update profile" };
  }

  revalidatePath('/dashboard/profile');
  return { success: true };
}
