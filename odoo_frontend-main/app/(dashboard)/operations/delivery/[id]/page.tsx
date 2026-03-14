"use client";

import { useOperationStore } from "@/store/operationStore";
import { useInventoryStore } from "@/store/inventoryStore";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  Plus, 
  ClipboardList, 
  Clock, 
  MapPin,
  Truck,
  AlertTriangle
} from "lucide-react";
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
import { useState, useEffect } from "react";
import api from "@/services/api";

export default function DeliveryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { operations, updateStatus } = useOperationStore();
  const { products, setProducts, updateProductStock, addMovement } = useInventoryStore();
  const [loading, setLoading] = useState(false);

  // Load products from backend if not already in the store
  useEffect(() => {
    const loadProducts = async () => {
      if (products.length > 0) return;
      try {
        const res = await api.get("/products");
        const backendProducts = res.data.map((p: { id: number; name: string; sku: string; category: string }) => ({
          id: String(p.id),
          name: p.name,
          sku: p.sku,
          stock: 100, // Default stock since backend doesn't track per-product stock directly
          demand: 0,
          reorderPoint: 10,
          supplier: "Default Supplier",
          status: "In Stock" as const,
          price: 0,
        }));
        if (backendProducts.length > 0) {
          setProducts(backendProducts);
        }
      } catch {
        console.warn("Could not load products from API");
      }
    };
    loadProducts();
  }, [products.length, setProducts]);

  const delivery = operations.find(o => o.id === params.id);

  if (!delivery) {
    return <div className="p-8 text-center">Delivery not found.</div>;
  }

  const checkStockAvailability = () => {
    return delivery.lines.every(line => {
      const product = products.find(p => p.id === line.productId);
      return product && product.stock >= line.demandQty;
    });
  };

  const handleValidate = async () => {
    if (!checkStockAvailability()) {
      toast.error("Insufficient stock! Cannot validate delivery.", {
        description: "Some products are out of stock or have limited quantity.",
        icon: <AlertTriangle className="h-5 w-5 text-rose-600" />
      });
      return;
    }

    setLoading(true);
    try {
      delivery.lines.forEach(line => {
        const product = products.find(p => p.id === line.productId);
        if (product) {
          updateProductStock(line.productId, product.stock - line.demandQty);
          addMovement({
            id: Math.random().toString(36).substr(2, 9),
            productName: line.productName,
            type: "Out",
            quantity: line.demandQty,
            warehouse: "Main Warehouse",
            location: "WH/Stock",
            date: new Date().toISOString().split('T')[0],
            reference: delivery.reference,
            status: "Done"
          });
        }
      });

      updateStatus(delivery.id, "done");
      toast.success(`Delivery ${delivery.reference} validated and shipped!`);
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
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">{delivery.reference}</h2>
        <Badge 
          className={
            delivery.status === "done" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" :
            delivery.status === "waiting" ? "bg-amber-100 text-amber-700 hover:bg-amber-100" :
            "bg-[#017E84]/10 text-[#017E84] hover:bg-[#017E84]/20"
          }
        >
          {delivery.status.toUpperCase()}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {delivery.status === "ready" && (
          <Button className="bg-[#714B67] hover:bg-[#5e3d56] text-white" onClick={handleValidate} disabled={loading}>
            <CheckCircle2 className="mr-2 h-4 w-4" /> 
            {loading ? "Processing..." : "Validate"}
          </Button>
        )}
        {delivery.status === "waiting" && (
          <Button className="bg-amber-600 hover:bg-amber-700 text-white" variant="outline">
            Check Availability
          </Button>
        )}
        <Button variant="outline" className="bg-white">
          <Printer className="mr-2 h-4 w-4" /> Print
        </Button>
        {delivery.status !== "done" && (
          <Button variant="outline" className="text-rose-600 hover:bg-rose-50 border-rose-200">
            <XCircle className="mr-2 h-4 w-4" /> Cancel
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Destination
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Delivery Address</p>
              <p className="font-semibold text-gray-900">{delivery.partner}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Scheduled Date</p>
                <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                  <Clock className="h-4 w-4 text-[#714B67]" />
                  {delivery.scheduleDate}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <ClipboardList className="h-4 w-4" /> Logistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Responsible</p>
                <p className="font-semibold text-gray-900">{delivery.responsible}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Carrier</p>
                <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                  <Truck className="h-4 w-4 text-[#017E84]" />
                  FedEx Express
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-gray-100">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold">Planned Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead>Product</TableHead>
                <TableHead className="text-center">Demand</TableHead>
                <TableHead className="text-center">Reserved</TableHead>
                <TableHead className="text-center">Done</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {delivery.lines.map((line) => {
                const product = products.find(p => p.id === line.productId);
                const isInsufficient = product && product.stock < line.demandQty;
                
                return (
                  <TableRow key={line.id} className={isInsufficient ? "bg-rose-50/50" : ""}>
                    <TableCell className="font-medium text-gray-900">
                      <div className="flex flex-col">
                        <span>{line.productName}</span>
                        {isInsufficient && (
                          <span className="text-[10px] text-rose-600 font-bold uppercase tracking-tighter">
                            Insufficient Stock ({product?.stock} available)
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-bold text-gray-700">{line.demandQty}</TableCell>
                    <TableCell className="text-center">
                      <span className={isInsufficient ? "text-rose-500" : "text-emerald-600"}>
                        {isInsufficient ? product?.stock : line.demandQty}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={delivery.status === "done" ? "font-bold text-[#714B67]" : "text-gray-300 italic"}>
                        {delivery.status === "done" ? line.demandQty : 0}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
