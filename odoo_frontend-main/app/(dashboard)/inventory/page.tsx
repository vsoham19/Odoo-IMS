"use client";

import { useEffect, useState } from "react";
import { useInventoryStore } from "@/store/inventoryStore";
import { InventoryTable } from "@/components/inventory-table";
import api from "@/services/api";
import { Loader2, Plus, Download, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from "@/types/inventory";
import { toast } from "sonner";
import { AddProductDialog } from "@/components/add-product-dialog";

const mockProducts: Product[] = [
  { id: "1", name: "Wireless Headphones", sku: "WH-100", stock: 5, demand: 120, reorderPoint: 10, supplier: "TechCorp", status: "Low Stock", price: 99.99 },
  { id: "2", name: "Mechanical Keyboard", sku: "MK-200", stock: 45, demand: 80, reorderPoint: 20, supplier: "PeripheralInc", status: "In Stock", price: 129.99 },
  { id: "3", name: "Gaming Mouse", sku: "GM-300", stock: 110, demand: 150, reorderPoint: 30, supplier: "PeripheralInc", status: "In Stock", price: 59.99 },
  { id: "4", name: "Webcam 1080p", sku: "WC-400", stock: 250, demand: 40, reorderPoint: 50, supplier: "VisionTech", status: "In Stock", price: 79.99 },
  { id: "5", name: "USB-C Hub", sku: "UH-500", stock: 0, demand: 200, reorderPoint: 100, supplier: "TechCorp", status: "Out of Stock", price: 39.99 },
];

export default function InventoryPage() {
  const { products, setProducts, isLoading, setLoading } = useInventoryStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const res = await api.get("/products");
        const mapped = res.data.map((p: { id: number; name: string; sku: string; category: string }) => ({
          id: String(p.id),
          name: p.name,
          sku: p.sku,
          stock: 100,
          demand: 0,
          reorderPoint: 10,
          supplier: p.category || "Default Supplier",
          status: "In Stock" as const,
          price: 0,
        }));
        setProducts(mapped.length > 0 ? mapped : mockProducts);
      } catch (error) {
        console.warn("API unavailable. Using mock products.");
        if (products.length === 0) setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, [setProducts, setLoading]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    try {
      const headers = ["ID", "Name", "SKU", "Stock", "Status", "Price", "Supplier"];
      const csvRows = [headers.join(",")];
      products.forEach(p => {
        csvRows.push([p.id, `"${p.name}"`, p.sku, p.stock, `"${p.status}"`, p.price, `"${p.supplier}"`].join(","));
      });
      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `inventory_export_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Inventory exported successfully!");
    } catch {
      toast.error("Export failed.");
    }
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Inventory Management</h2>
          <p className="text-muted-foreground text-gray-500">Manage your product catalog, stock levels, and suppliers.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            className="bg-white"
            onClick={handleExport}
          >
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <AddProductDialog />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search by product name or SKU..." 
            className="pl-9 mr-auto bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="bg-white" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="mr-2 h-4 w-4" /> Filters
        </Button>
      </div>

      {showFilters && (
        <div className="flex gap-2 flex-wrap animate-in fade-in duration-300">
          {["all", "In Stock", "Low Stock", "Out of Stock"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              className={statusFilter === status ? "bg-[#714B67] hover:bg-[#5e3d56] text-white" : "bg-white"}
              onClick={() => setStatusFilter(status)}
            >
              {status === "all" ? "All" : status}
            </Button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-md border border-gray-100 bg-white shadow-sm p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#714B67]" />
        </div>
      ) : (
        <InventoryTable products={filteredProducts} />
      )}
    </div>
  );
}
