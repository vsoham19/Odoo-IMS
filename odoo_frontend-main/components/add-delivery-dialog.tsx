"use client";

import { useState } from "react";
import { useOperationStore } from "@/store/operationStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddDeliveryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddDeliveryDialog({ open, onOpenChange }: AddDeliveryDialogProps) {
  const { addOperation, operations } = useOperationStore();
  const [partner, setPartner] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [productName, setProductName] = useState("");
  const [demandQty, setDemandQty] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!partner || !scheduleDate || !productName || !demandQty) {
      toast.error("Please fill all fields.");
      return;
    }

    const deliveryCount = operations.filter(o => o.type === "delivery").length;
    const refNum = String(deliveryCount + 1).padStart(4, "0");

    addOperation({
      id: `DEL-${Date.now()}`,
      reference: `WH/OUT/${refNum}`,
      type: "delivery",
      partner,
      scheduleDate,
      responsible: "Admin",
      status: "draft",
      lines: [
        {
          id: `L-${Date.now()}`,
          productId: String(Date.now()),
          productName,
          demandQty: Number(demandQty),
          doneQty: 0,
        },
      ],
    });

    toast.success("Delivery created successfully.");
    setPartner("");
    setScheduleDate("");
    setProductName("");
    setDemandQty("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-gray-900">New Delivery</DialogTitle>
          <DialogDescription>
            Create a new outgoing delivery order for a customer.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="delivery-partner">Delivery Address / Customer</Label>
            <Input
              id="delivery-partner"
              placeholder="e.g. Acme Corp (NY Warehouse)"
              value={partner}
              onChange={(e) => setPartner(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="delivery-date">Scheduled Date</Label>
            <Input
              id="delivery-date"
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="delivery-product">Product Name</Label>
              <Input
                id="delivery-product"
                placeholder="e.g. USB-C Hub"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="delivery-qty">Demand Qty</Label>
              <Input
                id="delivery-qty"
                type="number"
                min="1"
                placeholder="e.g. 25"
                value={demandQty}
                onChange={(e) => setDemandQty(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#714B67] hover:bg-[#5e3d56] text-white">
              Create Delivery
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
