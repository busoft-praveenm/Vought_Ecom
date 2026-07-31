'use server';

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  return {
    "Content-Type": "application/json",
    "Cookie": `access_token=${token}`
  };
}

export async function getWarehousesAction() {
  try {
    const res = await fetch(`${BACKEND_URL}/warehouses`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch warehouses');
    return res.json();
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    return [];
  }
}

export async function getWarehouseAction(id: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/warehouses/${id}`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch warehouse');
    return res.json();
  } catch (error) {
    console.error("Error fetching warehouse:", error);
    return null;
  }
}

export async function createWarehouseAction(data: any) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/warehouses`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create warehouse');
    revalidatePath('/dashboard/admin/warehouses');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateWarehouseAction(id: string, data: any) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/warehouses/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update warehouse');
    revalidatePath('/dashboard/admin/warehouses');
    revalidatePath(`/dashboard/admin/warehouses/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteWarehouseAction(id: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/warehouses/${id}`, {
      method: 'DELETE',
      headers
    });
    if (!res.ok) throw new Error('Failed to delete warehouse');
    revalidatePath('/dashboard/admin/warehouses');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getWarehouseInventoryAction(id: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/warehouses/${id}/inventory`, {
      headers,
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch inventory');
    return res.json();
  } catch (error) {
    console.error("Error fetching warehouse inventory:", error);
    return [];
  }
}

export async function setWarehouseInventoryAction(id: string, productId: number, quantity: number) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BACKEND_URL}/warehouses/${id}/inventory`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ productId, quantity })
    });
    if (!res.ok) throw new Error('Failed to set inventory');
    revalidatePath(`/dashboard/admin/warehouses/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
