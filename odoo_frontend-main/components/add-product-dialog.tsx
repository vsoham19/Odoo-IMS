"use client";

import { useState } from "react";
import { useInventoryStore } from "@/store/inventoryStore";
import { Product, ProductStatus } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddProductDialog() {
  const [open, setOpen] = useState(false);
  const { addProduct } = useInventoryStore();

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    stock: 0,
    demand: 0,
    reorderPoint: 0,
    supplier: "",
    status: "In Stock" as ProductStatus,
    price: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Save to backend database
      let backendId = Math.random().toString(36).substr(2, 9);
      try {
        const res = await api.post("/products", {
          name: formData.name,
          sku: formData.sku,
          category: formData.supplier, // map supplier to category for backend
        });
        backendId = String(res.data.id);
      } catch {
        console.warn("Backend unavailable, saving locally only.");
      }

      const newProduct: Product = {
        id: backendId,
        ...formData,
      };
      
      addProduct(newProduct);
      toast.success(`Product ${newProduct.name} added successfully!`);
      setOpen(false);
      setFormData({
        name: "",
        sku: "",
        stock: 0,
        demand: 0,
        reorderPoint: 0,
        supplier: "",
        status: "In Stock",
        price: 0,
      });
    } catch (e) {
      toast.error("Failed to add product");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[#714B67] text-primary-foreground shadow hover:bg-[#5e3d56] h-9 px-4 py-2">
        <Plus className="mr-2 h-4 w-4" /> Add Product
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">Product Name</Label>
              <Input 
                id="name" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input 
                id="sku" 
                required 
                value={formData.sku}
                onChange={(e) => setFormData({...formData, sku: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input 
                id="supplier" 
                required 
                value={formData.supplier}
                onChange={(e) => setFormData({...formData, supplier: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Initial Stock</Label>
              <Input 
                id="stock" 
                type="number" 
                required 
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reorderPoint">Reorder Point</Label>
              <Input 
                id="reorderPoint" 
                type="number" 
                required 
                value={formData.reorderPoint}
                onChange={(e) => setFormData({...formData, reorderPoint: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input 
                id="price" 
                type="number" 
                step="0.01" 
                required 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Initial Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(val) => setFormData({...formData, status: val as ProductStatus})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#714B67] hover:bg-[#5e3d56] text-white">
              Save Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
