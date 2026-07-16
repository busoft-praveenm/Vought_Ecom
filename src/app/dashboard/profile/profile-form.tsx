"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { CardContent } from "@/components/card";
import { toast } from "sonner";
import { updateProfileAction } from "./actions";

export function ProfileForm({ user, profile }: { user: any; profile: any }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    mobileNumber: profile?.mobileNumber || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const result = await updateProfileAction(formData);

      if (!result.success) {
        throw new Error(result.error || "Failed to update profile");
      }

      toast.success("Profile updated successfully.");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing) {
    return (
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
            />
          </div>

          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input value={user.email} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobileNumber">Mobile Number</Label>
            <Input
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="Mobile Number"
            />
          </div>

          <div className="space-y-2">
            <Label>Account Status</Label>
            <Input value={user.status} className="capitalize" disabled />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent className="space-y-6 pt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">First Name</p>
          <p className="text-base font-semibold">{profile.firstName || 'Not provided'}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Last Name</p>
          <p className="text-base font-semibold">{profile.lastName || 'Not provided'}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Email Address</p>
          <p className="text-base font-semibold">{user.email}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Mobile Number</p>
          <p className="text-base font-semibold">{profile.mobileNumber || 'Not provided'}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Account Status</p>
          <p className="text-base font-semibold capitalize">{user.status}</p>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
      </div>
    </CardContent>
  );
}
