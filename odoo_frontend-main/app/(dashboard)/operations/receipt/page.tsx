"use client";

import { useEffect, useState } from "react";
import { useOperationStore } from "@/store/operationStore";
import { Operation } from "@/types/inventory";
import { Loader2, Plus, Search, Filter, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OperationStatusBadge } from "@/components/operation-status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export default function ReceiptsPage() {
  const { operations, setOperations, isLoading, setLoading } = useOperationStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const receipts = operations.filter(o => o.type === "receipt");

  useEffect(() => {
    // Mock initial receipts for demo
    if (receipts.length === 0) {
      setOperations([
        {
          id: "REC-001",
          reference: "WH/IN/0001",
          type: "receipt",
          partner: "TechCorp Ltd",
          scheduleDate: "2024-03-15",
          responsible: "Admin",
          status: "ready",
          lines: [
            { id: "L1", productId: "1", productName: "Wireless Headphones", demandQty: 100, doneQty: 0 }
          ]
        },
        {
          id: "REC-002",
          reference: "WH/IN/0002",
          type: "receipt",
          partner: "Peripheral Inc",
          scheduleDate: "2024-03-16",
          responsible: "Admin",
          status: "draft",
          lines: [
            { id: "L2", productId: "2", productName: "Mechanical Keyboard", demandQty: 50, doneQty: 0 }
          ]
        }
      ]);
    }
  }, [setOperations, receipts.length]);

  const filteredReceipts = receipts.filter(r => {
    const matchesSearch = r.reference.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.partner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Receipts</h2>
          <p className="text-muted-foreground text-gray-500">Incoming inventory shipments from suppliers.</p>
        </div>
        <Button className="bg-[#714B67] hover:bg-[#5e3d56] text-white">
          <Plus className="mr-2 h-4 w-4" /> New Receipt
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search reference or partner..." 
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
          {["all", "draft", "waiting", "ready", "done"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              className={statusFilter === status ? "bg-[#714B67] hover:bg-[#5e3d56] text-white" : "bg-white"}
              onClick={() => setStatusFilter(status)}
            >
              {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      )}

      <div className="rounded-md border border-gray-100 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead>Reference</TableHead>
              <TableHead>Receive From</TableHead>
              <TableHead>Scheduled Date</TableHead>
              <TableHead>Source Document</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReceipts.map((receipt) => (
              <TableRow key={receipt.id} className="cursor-pointer hover:bg-gray-50/30 transition-colors">
                <TableCell className="font-bold text-[#714B67]">
                  <Link href={`/operations/receipt/${receipt.id}`}>{receipt.reference}</Link>
                </TableCell>
                <TableCell className="text-gray-900 font-medium">{receipt.partner}</TableCell>
                <TableCell className="text-gray-500">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    {receipt.scheduleDate}
                  </div>
                </TableCell>
                <TableCell className="text-gray-400 font-mono text-xs">P00012</TableCell>
                <TableCell><OperationStatusBadge status={receipt.status} /></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => window.location.href = `/operations/receipt/${receipt.id}`}>
                    View Details <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredReceipts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No receipts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
