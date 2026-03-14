"use client";

import { useEffect, useState } from "react";
import { useOperationStore } from "@/store/operationStore";
import { Operation } from "@/types/inventory";
import { Plus, Search, Filter, ArrowRight, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OperationStatusBadge } from "@/components/operation-status-badge";
import { AddDeliveryDialog } from "@/components/add-delivery-dialog";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import Link from "next/link";

export default function DeliveryPage() {
  const { operations, setOperations } = useOperationStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("list");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const deliveries = operations.filter(o => o.type === "delivery");

  useEffect(() => {
    // Mock initial deliveries for demo
    if (deliveries.length === 0) {
      setOperations([
        {
          id: "DEL-001",
          reference: "WH/OUT/0001",
          type: "delivery",
          partner: "Acme Corp (NY Warehouse)",
          scheduleDate: "2024-03-14",
          responsible: "Admin",
          status: "ready",
          lines: [
            { id: "L3", productId: "1", productName: "Wireless Headphones", demandQty: 10, doneQty: 0 }
          ]
        },
        {
          id: "DEL-002",
          reference: "WH/OUT/0002",
          type: "delivery",
          partner: "Central Store",
          scheduleDate: "2024-03-15",
          responsible: "Admin",
          status: "waiting",
          lines: [
            { id: "L4", productId: "5", productName: "USB-C Hub", demandQty: 25, doneQty: 0 }
          ]
        }
      ]);
    }
  }, [setOperations, deliveries.length]);

  const filteredDeliveries = deliveries.filter(d => {
    const matchesSearch = d.reference.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.partner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });


  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Deliveries</h2>
          <p className="text-muted-foreground text-gray-500">Outgoing customer orders and stock transfers.</p>
        </div>
        <div className="flex gap-2">
          <Tabs value={view} onValueChange={setView} className="hidden md:block">
            <TabsList>
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button className="bg-[#714B67] hover:bg-[#5e3d56] text-white" onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Delivery
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search reference or address..." 
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

      {view === "list" ? (
        <div className="rounded-md border border-gray-100 bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead>Reference</TableHead>
                <TableHead>Delivery Address</TableHead>
                <TableHead>Scheduled Date</TableHead>
                <TableHead>Source Document</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeliveries.map((delivery) => (
                <TableRow key={delivery.id} className="cursor-pointer hover:bg-gray-50/30 transition-colors">
                  <TableCell className="font-bold text-[#714B67]">
                    <Link href={`/operations/delivery/${delivery.id}`}>{delivery.reference}</Link>
                  </TableCell>
                  <TableCell className="text-gray-900 font-medium">{delivery.partner}</TableCell>
                  <TableCell className="text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      {delivery.scheduleDate}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-400 font-mono text-xs">S00245</TableCell>
                  <TableCell><OperationStatusBadge status={delivery.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => window.location.href = `/operations/delivery/${delivery.id}`}>
                      Process <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredDeliveries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No deliveries found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDeliveries.map((delivery) => (
            <Link key={delivery.id} href={`/operations/delivery/${delivery.id}`} className="block group">
              <Card className="shadow-sm group-hover:shadow-md transition-shadow border-gray-100 h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-[#714B67]">{delivery.reference}</span>
                    <OperationStatusBadge status={delivery.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm font-semibold truncate">{delivery.partner}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="h-3.5 w-3.5" />
                    {delivery.scheduleDate}
                  </div>
                  <div className="pt-2 flex items-center text-[#714B67] text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                    View & Process <ArrowRight className="ml-1 h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
      <AddDeliveryDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  );
}
