"use client";

import { useEffect, useState } from "react";
import { useInventoryStore } from "@/store/inventoryStore";
import { Product } from "@/types/inventory";
import api from "@/services/api";
import { Loader2, Plus, Search, Filter, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AddProductDialog } from "@/components/add-product-dialog";

export default function ProductsPage() {
  const { products, setProducts, deleteProduct, isLoading, setLoading } = useInventoryStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (products.length > 0) return; // Already loaded or added
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
          supplier: "Default Supplier",
          status: "In Stock" as const,
          price: 0,
        }));
        setProducts(mapped);
      } catch (error) {
        console.warn("API unavailable, using existing state.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [setProducts, setLoading, products.length]);

  const handleDelete = async (id: string, name: string) => {
    try {
      await api.delete(`/products/${id}`);
    } catch (e) {
      console.warn("Backend unavailable, deleting locally only.");
    }
    deleteProduct(id);
    toast.success(`Product ${name} deleted.`);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Products</h2>
          <p className="text-muted-foreground text-gray-500">View and manage your product master records.</p>
        </div>
        <AddProductDialog />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search products..." 
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
        <div className="rounded-md border border-gray-100 bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                <TableHead>Product Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50/30 transition-colors">
                  <TableCell className="font-medium text-gray-900">{product.name}</TableCell>
                  <TableCell className="text-gray-500 font-mono text-xs">{product.sku}</TableCell>
                  <TableCell className="text-gray-700 font-medium">${product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-gray-500">${(product.cost || product.price * 0.7).toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{product.stock}</span>
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Units</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={
                        product.status === "In Stock" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        product.status === "Low Stock" ? "bg-amber-50 text-amber-700 border-amber-200" :
                        "bg-rose-50 text-rose-700 border-rose-200"
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100 focus:outline-none">
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-rose-600 focus:text-rose-600 cursor-pointer"
                          onClick={() => handleDelete(product.id, product.name)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
