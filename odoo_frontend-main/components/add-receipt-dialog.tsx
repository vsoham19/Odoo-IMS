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

interface AddReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddReceiptDialog({ open, onOpenChange }: AddReceiptDialogProps) {
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

    const receiptCount = operations.filter(o => o.type === "receipt").length;
    const refNum = String(receiptCount + 1).padStart(4, "0");

    addOperation({
      id: `REC-${Date.now()}`,
      reference: `WH/IN/${refNum}`,
      type: "receipt",
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

    toast.success("Receipt created successfully.");
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
          <DialogTitle className="text-gray-900">New Receipt</DialogTitle>
          <DialogDescription>
            Create a new incoming inventory receipt from a supplier.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="receipt-partner">Receive From (Supplier)</Label>
            <Input
              id="receipt-partner"
              placeholder="e.g. TechCorp Ltd"
              value={partner}
              onChange={(e) => setPartner(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="receipt-date">Scheduled Date</Label>
            <Input
              id="receipt-date"
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="receipt-product">Product Name</Label>
              <Input
                id="receipt-product"
                placeholder="e.g. Wireless Mouse"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receipt-qty">Demand Qty</Label>
              <Input
                id="receipt-qty"
                type="number"
                min="1"
                placeholder="e.g. 50"
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
              Create Receipt
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
