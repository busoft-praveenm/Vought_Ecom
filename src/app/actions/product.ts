"use server";

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
