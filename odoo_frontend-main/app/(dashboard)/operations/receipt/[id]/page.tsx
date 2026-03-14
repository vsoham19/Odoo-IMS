"use client";

import { useOperationStore } from "@/store/operationStore";
import { useInventoryStore } from "@/store/inventoryStore";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, XCircle, Printer, Plus, ClipboardList, Clock, User, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function ReceiptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { operations, updateStatus } = useOperationStore();
  const { updateProductStock, addMovement } = useInventoryStore();
  const [loading, setLoading] = useState(false);

  const receipt = operations.find(o => o.id === params.id);

  if (!receipt) {
    return <div className="p-8 text-center">Receipt not found.</div>;
  }

  const handleValidate = async () => {
    setLoading(true);
    try {
      // Logic: DoneQty = DemandQty for simple demo
      // In a real app we'd edit DoneQty
      receipt.lines.forEach(line => {
        updateProductStock(line.productId, line.demandQty); // In reality this should be currentStock + demandQty
        addMovement({
          id: Math.random().toString(36).substr(2, 9),
          productName: line.productName,
          type: "In",
          quantity: line.demandQty,
          warehouse: "Main Warehouse",
          location: "WH/Stock",
          date: new Date().toISOString().split('T')[0],
          reference: receipt.reference,
          status: "Done"
        });
      });

      updateStatus(receipt.id, "done");
      toast.success(`Receipt ${receipt.reference} validated! Stock updated.`);
    } catch (e) {
      toast.error("Validation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">{receipt.reference}</h2>
        <Badge 
          className={
            receipt.status === "done" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" :
            receipt.status === "ready" ? "bg-amber-100 text-amber-700 hover:bg-amber-100" :
            "bg-slate-100 text-slate-700 hover:bg-slate-100"
          }
        >
          {receipt.status.toUpperCase()}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {receipt.status !== "done" && (
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleValidate} disabled={loading}>
            <CheckCircle2 className="mr-2 h-4 w-4" /> 
            {loading ? "Validating..." : "Validate"}
          </Button>
        )}
        <Button variant="outline" className="bg-white">
          <Printer className="mr-2 h-4 w-4" /> Print
        </Button>
        {receipt.status !== "done" && receipt.status !== "cancel" && (
          <Button variant="outline" className="text-rose-600 hover:bg-rose-50 border-rose-200">
            <XCircle className="mr-2 h-4 w-4" /> Cancel
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <ClipboardList className="h-4 w-4" /> Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Receive From</p>
                <p className="font-semibold text-gray-900">{receipt.partner}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Scheduled Date</p>
                <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                  <Clock className="h-4 w-4 text-[#714B67]" />
                  {receipt.scheduleDate}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <User className="h-4 w-4" /> Logistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Responsible</p>
                <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                  <UserCheck className="h-4 w-4 text-emerald-500" />
                  {receipt.responsible}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Operation Type</p>
                <p className="font-semibold text-gray-900">Receipt (WH/IN)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-gray-100">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold">Operations</CardTitle>
          {receipt.status !== "done" && (
            <Button size="sm" variant="ghost" className="text-[#714B67]">
              <Plus className="mr-2 h-4 w-4" /> Add Line
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead>Product</TableHead>
                <TableHead className="text-center">Demand</TableHead>
                <TableHead className="text-center">Done</TableHead>
                <TableHead className="text-right">UoM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipt.lines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell className="font-medium text-gray-900">{line.productName}</TableCell>
                  <TableCell className="text-center font-bold text-gray-700">{line.demandQty}</TableCell>
                  <TableCell className="text-center">
                    <span className={receipt.status === "done" ? "font-bold text-emerald-600" : "text-gray-400 italic"}>
                      {receipt.status === "done" ? line.demandQty : 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-gray-400">Units</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
