import { getWarehousesAction, deleteWarehouseAction } from "@/app/actions/warehouses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Building, MapPin, Clock, Edit, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function WarehousesPage() {
  const warehouses = await getWarehousesAction();

  const handleDelete = async (formData: FormData) => {
    "use server";
    const id = formData.get("id") as string;
    await deleteWarehouseAction(id);
    revalidatePath("/dashboard/admin/warehouses");
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Warehouses</h1>
        <Link
          href="/dashboard/admin/warehouses/new"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Warehouse
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses.map((warehouse: any) => (
          <Card key={warehouse.id} className="bg-card hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold">{warehouse.name}</CardTitle>
              <Building className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{warehouse.address || "No address provided"}</span>
                </div>
                
                <div className="flex flex-col gap-1 text-xs text-muted-foreground bg-zinc-100 dark:bg-zinc-800/50 p-3 rounded-md">
                  <div className="flex justify-between">
                    <span>Coordinates:</span>
                    <span className="font-mono">{warehouse.lat}, {warehouse.lng}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3" />
                    <span>Processing Time: {warehouse.processingTimeHours} hours</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Link
                    href={`/dashboard/admin/warehouses/${warehouse.id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-50 text-sm py-2 rounded-md transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    Manage
                  </Link>
                  <form action={handleDelete}>
                    <input type="hidden" name="id" value={warehouse.id} />
                    <button
                      type="submit"
                      className="flex items-center justify-center bg-red-900/20 hover:bg-red-900/40 text-red-400 p-2 rounded-md transition-colors h-full aspect-square"
                      title="Delete Warehouse"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {warehouses.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-card/50 rounded-lg border border-dashed">
            No warehouses found. Click "Add Warehouse" to create one.
          </div>
        )}
      </div>
    </div>
  );
}
