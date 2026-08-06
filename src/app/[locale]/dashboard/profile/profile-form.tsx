"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { CardContent } from "@/components/card";
import { toast } from "sonner";
import { updateProfileAction } from "./actions";
import { GoogleMapPicker, LocationData } from "@/components/google-map-picker";

import { MapPin } from "lucide-react";

export function ProfileForm({ user, profile }: { user: any; profile: any }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    mobileNumber: profile?.mobileNumber || "",
    billingAddress: profile?.billingAddress || "",
    deliveryAddress: profile?.deliveryAddress || "",
    deliveryLat: profile?.deliveryLat || null,
    deliveryLng: profile?.deliveryLng || null,
  });
  const [showMap, setShowMap] = useState(false);

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

  if (showMap) {
    return (
      <CardContent className="space-y-6 pt-6">
        <h3 className="text-lg font-semibold">Select Delivery Location</h3>
        <GoogleMapPicker 
          initialLat={formData.deliveryLat}
          initialLng={formData.deliveryLng}
          onCancel={() => setShowMap(false)}
          onLocationSelect={(location: LocationData) => {
            setFormData({
              ...formData,
              deliveryAddress: location.address,
              deliveryLat: location.lat,
              deliveryLng: location.lng
            });
            setShowMap(false);
          }}
        />
      </CardContent>
    );
  }

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

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="billingAddress">Billing Address</Label>
            <textarea
              id="billingAddress"
              name="billingAddress"
              value={formData.billingAddress}
              onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
              placeholder="Enter your billing address"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="deliveryAddress">Delivery Address</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowMap(true)} className="h-8">
                <MapPin className="w-4 h-4 mr-1" />
                Pick on Map
              </Button>
            </div>
            <textarea
              id="deliveryAddress"
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
              placeholder="Enter your delivery address or pick from map"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {formData.deliveryLat && formData.deliveryLng && (
              <p className="text-xs text-muted-foreground">
                Coordinates saved: {formData.deliveryLat.toFixed(4)}, {formData.deliveryLng.toFixed(4)}
              </p>
            )}
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

        <div className="space-y-1 md:col-span-2">
          <p className="text-sm font-medium text-muted-foreground">Billing Address</p>
          <p className="text-base font-semibold">{profile.billingAddress || 'Not provided'}</p>
        </div>

        <div className="space-y-1 md:col-span-2">
          <p className="text-sm font-medium text-muted-foreground">Delivery Address</p>
          <p className="text-base font-semibold">{profile.deliveryAddress || 'Not provided'}</p>
          {profile.deliveryLat && profile.deliveryLng && (
            <p className="text-xs text-muted-foreground mt-1">
              <MapPin className="w-3 h-3 inline mr-1" />
              {Number(profile.deliveryLat).toFixed(4)}, {Number(profile.deliveryLng).toFixed(4)}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
      </div>
    </CardContent>
  );
}
