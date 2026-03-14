"use client";

import { useInventoryStore } from "@/store/inventoryStore";
import { Warehouse } from "@/types/inventory";
import { Plus, Store, MapPin, Loader2, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function WarehousePage() {
  const { warehouses, addWarehouse } = useInventoryStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newWarehouse, setNewWarehouse] = useState({ name: "", code: "", address: "" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const warehouse: Warehouse = {
      id: Math.random().toString(36).substr(2, 9),
      ...newWarehouse,
    };
    addWarehouse(warehouse);
    toast.success(`Warehouse ${warehouse.name} created!`);
    setNewWarehouse({ name: "", code: "", address: "" });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Warehouse Settings</h2>
          <p className="text-muted-foreground text-gray-500">Manage your physical storage locations and codes.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="bg-[#714B67] hover:bg-[#5e3d56] text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Warehouse
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isAdding && (
          <Card className="border-[#714B67]/20 shadow-lg animate-in zoom-in-95 duration-200">
            <CardHeader>
              <CardTitle className="text-lg">New Warehouse</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input 
                    required 
                    value={newWarehouse.name}
                    onChange={(e) => setNewWarehouse({...newWarehouse, name: e.target.value})}
                    placeholder="Main Warehouse"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Short Code</Label>
                  <Input 
                    required 
                    value={newWarehouse.code}
                    onChange={(e) => setNewWarehouse({...newWarehouse, code: e.target.value.toUpperCase()})}
                    placeholder="WH1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input 
                    required 
                    value={newWarehouse.address}
                    onChange={(e) => setNewWarehouse({...newWarehouse, address: e.target.value})}
                    placeholder="123 Industrial Rd"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1 bg-[#714B67] hover:bg-[#5e3d56]">Save</Button>
                  <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {warehouses.map((wh) => (
          <Card key={wh.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#714B67]/10 rounded-lg">
                  <Store className="h-5 w-5 text-[#714B67]" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">{wh.name}</CardTitle>
                  <CardDescription className="font-mono text-xs">{wh.code}</CardDescription>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100 focus:outline-none">
                  <MoreVertical className="h-4 w-4 text-gray-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-rose-600">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-start gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                <span>{wh.address}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {warehouses.length === 0 && !isAdding && (
          <div className="col-span-full py-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <Store className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No warehouses configured yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
