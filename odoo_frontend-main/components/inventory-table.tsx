"use client";

import { useState } from "react";
import { Product } from "@/types/inventory";
import { useInventoryStore } from "@/store/inventoryStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Save, X } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

export function InventoryTable({ products }: { products: Product[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(0);
  const { updateProductStock } = useInventoryStore();

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setEditStock(product.stock);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleSave = async (id: string) => {
    try {
      // Calling PUT /inventory/update API
      await api.put(`/inventory/update`, { id, stock: editStock });
      updateProductStock(id, editStock);
      toast.success("Stock updated successfully");
    } catch (e) {
      toast.error("Failed to update stock. Using local state fallback.");
      // Fallback update for demo purposes
      updateProductStock(id, editStock);
    }
    setEditingId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Stock":
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80">In Stock</Badge>;
      case "Low Stock":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100/80">Low Stock</Badge>;
      case "Out of Stock":
        return <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100/80">Out of Stock</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Demand</TableHead>
            <TableHead className="hidden md:table-cell">Reorder Point</TableHead>
            <TableHead className="hidden lg:table-cell">Supplier</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="hover:bg-gray-50/50">
              <TableCell className="font-medium text-gray-900">{product.name}</TableCell>
              <TableCell className="text-gray-500 text-xs">{product.sku}</TableCell>
              <TableCell>
                {editingId === product.id ? (
                  <Input 
                    type="number" 
                    value={editStock} 
                    onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                    className="w-20 h-8"
                  />
                ) : (
                  <span className={product.stock <= product.reorderPoint ? "text-rose-600 font-semibold" : ""}>
                    {product.stock}
                  </span>
                )}
              </TableCell>
              <TableCell>{product.demand}</TableCell>
              <TableCell className="hidden md:table-cell text-gray-500">{product.reorderPoint}</TableCell>
              <TableCell className="hidden lg:table-cell text-gray-500">{product.supplier}</TableCell>
              <TableCell>{getStatusBadge(product.status)}</TableCell>
              <TableCell className="text-right">
                {editingId === product.id ? (
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600" onClick={() => handleSave(product.id)}>
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400" onClick={cancelEdit}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-[#714B67]" onClick={() => handleEditClick(product)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                No products found in inventory.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
