"use client";

import { useUserStore } from "@/store/userStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useUserStore();

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6 pb-8 max-w-2xl animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Settings</h2>
        <p className="text-muted-foreground text-gray-500">Manage your account preferences and application settings.</p>
      </div>

      <Card className="border-gray-100 shadow-sm">
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue={user?.name || "Admin User"} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue={user?.email || "admin@example.com"} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" disabled value={user?.role || "Administrator"} className="bg-gray-50 text-gray-500" />
          </div>
          <Button onClick={handleSave} className="bg-[#714B67] hover:bg-[#5e3d56] text-white mt-4">
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </CardContent>
      </Card>
      
      <Card className="border-gray-100 shadow-sm border-rose-100">
        <CardHeader>
          <CardTitle className="text-rose-600">Danger Zone</CardTitle>
          <CardDescription>Actions here cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
