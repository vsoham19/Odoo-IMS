"use client";

import { useInventoryStore } from "@/store/inventoryStore";
import { Search, Filter, History, ArrowDownLeft, ArrowUpRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

export default function MoveHistoryPage() {
  const { movements } = useInventoryStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMovements = movements.filter(m => 
    m.productName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Move History</h2>
          <p className="text-muted-foreground text-gray-500">Complete audit log of all stock transactions.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search movements..." 
            className="pl-9 mr-auto bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="bg-white">
          <Filter className="mr-2 h-4 w-4" /> Filters
        </Button>
      </div>

      <div className="rounded-md border border-gray-100 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead>Reference</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>From/To</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMovements.map((move) => (
              <TableRow key={move.id} className="hover:bg-gray-50/30 transition-colors">
                <TableCell className="font-bold text-[#714B67]">{move.reference}</TableCell>
                <TableCell className="text-gray-500 text-sm whitespace-nowrap">{move.date}</TableCell>
                <TableCell className="font-medium text-gray-900">{move.productName}</TableCell>
                <TableCell className="text-xs text-gray-500 italic">
                  {move.type === "In" ? `Partner → ${move.location}` : `${move.location} → Customer`}
                </TableCell>
                <TableCell className="text-center">
                  <div className={`flex items-center justify-center gap-1 font-bold ${
                    move.type === "In" ? "text-emerald-600" : "text-rose-600"
                  }`}>
                    {move.type === "In" ? "+" : "-"} {move.quantity}
                    {move.type === "In" ? (
                      <ArrowDownLeft className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className="bg-gray-50 text-gray-600 font-bold border-gray-200">
                    {move.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {filteredMovements.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No stock movements recorded yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
