"use client";

import { useInventoryStore } from "@/store/inventoryStore";
import { Location } from "@/types/inventory";
import { Plus, MapPin, Loader2, MoreVertical, Trash2, Search, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LocationPage() {
  const { locations, warehouses, addLocation } = useInventoryStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newLocation, setNewLocation] = useState({ name: "", code: "", warehouseId: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocation.warehouseId) return toast.error("Please select a warehouse");
    
    const location: Location = {
      id: Math.random().toString(36).substr(2, 9),
      ...newLocation,
    };
    addLocation(location);
    toast.success(`Location ${location.name} created!`);
    setNewLocation({ name: "", code: "", warehouseId: "" });
    setIsAdding(false);
  };

  const getWarehouseName = (id: string) => {
    return warehouses.find(w => w.id === id)?.name || "Unknown";
  };

  const filteredLocations = locations.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Locations</h2>
          <p className="text-muted-foreground text-gray-500">Manage internal storage bins and shelves.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="bg-[#714B67] hover:bg-[#5e3d56] text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Location
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search locations..." 
            className="pl-9 mr-auto bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isAdding && (
        <Card className="border-[#714B67]/20 shadow-md mb-6 animate-in slide-in-from-top-4 duration-200">
          <CardContent className="pt-6">
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label>Warehouse</Label>
                <Select 
                  value={newLocation.warehouseId ?? ""} 
                  onValueChange={(val) => { if (val) setNewLocation({...newLocation, warehouseId: val}); }}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select Warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map(w => (
                      <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                    ))}
                    {warehouses.length === 0 && (
                      <SelectItem value="none" disabled>No warehouses found</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Location Name</Label>
                <Input 
                  required 
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                  placeholder="Shelf A1"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Short Code</Label>
                <Input 
                  required 
                  value={newLocation.code}
                  onChange={(e) => setNewLocation({...newLocation, code: e.target.value.toUpperCase()})}
                  placeholder="SH-A1"
                  className="bg-white"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-[#714B67] hover:bg-[#5e3d56]">Save</Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsAdding(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="rounded-md border border-gray-100 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead>Location Name</TableHead>
              <TableHead>Short Code</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLocations.map((loc) => (
              <TableRow key={loc.id}>
                <TableCell className="font-medium text-gray-900 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#714B67]" />
                  {loc.name}
                </TableCell>
                <TableCell className="text-gray-500 font-mono text-xs">{loc.code}</TableCell>
                <TableCell className="text-gray-700">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-gray-400" />
                    {getWarehouseName(loc.warehouseId)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600 hover:text-rose-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredLocations.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No locations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
