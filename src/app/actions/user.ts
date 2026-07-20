"use server";

import { cookies } from "next/headers";

export async function updateUserStatus(userId: number, status: string) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const res = await fetch(`${backendUrl}/users/${userId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Cookie: `access_token=${token}` } : {}),
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { success: false, error: errorData.message || "Failed to update user status" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating user status:", error);
    return { success: false, error: "Internal server error" };
  }
}
