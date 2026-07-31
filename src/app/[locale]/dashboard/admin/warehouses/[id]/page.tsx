import { getWarehouseAction, getWarehouseInventoryAction, setWarehouseInventoryAction } from "@/app/actions/warehouses";
import { getProductsAction } from "@/app/actions/product";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Package, Save } from "lucide-react";
import Image from "next/image";

export default async function WarehouseDetailPage({ params }: { params: { id: string } }) {
  const warehouseId = params.id;
  const warehouse = await getWarehouseAction(warehouseId);
  if (!warehouse || !warehouse.id) {
    notFound();
  }

  const [inventory, productsData] = await Promise.all([
    getWarehouseInventoryAction(warehouseId),
    getProductsAction(1, 100) // Getting up to 100 products for inventory management
  ]);

  const products = productsData.results || [];
  
  // Map product IDs to their current inventory in this warehouse
  const inventoryMap = inventory.reduce((acc: any, item: any) => {
    if (item.product?.id) {
      acc[item.product.id] = item.quantity;
    }
    return acc;
  }, {});

  const handleUpdateStock = async (formData: FormData) => {
    "use server";
    const productId = parseInt(formData.get("productId") as string, 10);
    const quantity = parseInt(formData.get("quantity") as string, 10);
    await setWarehouseInventoryAction(warehouseId, productId, quantity);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{warehouse.name}</h1>
        <p className="text-muted-foreground">{warehouse.address}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Warehouse Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-muted-foreground">Status</span>
              <span className={warehouse.isActive ? "text-green-500" : "text-red-500"}>
                {warehouse.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-muted-foreground">Latitude</span>
              <span className="font-mono">{warehouse.lat}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-muted-foreground">Longitude</span>
              <span className="font-mono">{warehouse.lng}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-muted-foreground">Processing Time</span>
              <span>{warehouse.processingTimeHours} hours</span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Manage Inventory</CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.map((product: any) => (
                <div key={product.id} className="flex items-center gap-4 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
                  <div className="w-12 h-12 relative rounded bg-zinc-800 overflow-hidden shrink-0">
                    <Image
                      src={product.imageUrl || `https://picsum.photos/seed/${product.id}/100/100`}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{product.sku}</p>
                  </div>
                  <form action={handleUpdateStock} className="flex items-center gap-2 shrink-0">
                    <input type="hidden" name="productId" value={product.id} />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground hidden sm:inline">Qty:</span>
                      <input
                        type="number"
                        name="quantity"
                        min="0"
                        defaultValue={inventoryMap[product.id] || 0}
                        className="w-20 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-primary/20 hover:bg-primary/40 text-primary p-1.5 rounded transition-colors"
                      title="Update Stock"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              ))}
              {products.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No products found to manage inventory.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
