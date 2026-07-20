"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateUserStatus } from "@/app/actions/user";

interface CustomerStatusToggleProps {
  customerId: number;
  initialStatus: string;
  canDeactivate: boolean;
}

export function CustomerStatusToggle({ customerId, initialStatus, canDeactivate }: CustomerStatusToggleProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    if (status === "active" && !canDeactivate) {
      toast.error("Action Not Allowed", {
        description: "The primary admin user cannot be deactivated.",
      });
      return;
    }

    const newStatus = status === "active" ? "inactive" : "active";
    setIsLoading(true);

    try {
      const result = await updateUserStatus(customerId, newStatus);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      setStatus(newStatus);
      toast.success("Success", {
        description: `User status changed to ${newStatus}.`,
      });
      router.refresh();
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Error", {
        description: "Failed to update user status.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isActive = status === "active";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isActive}
      disabled={isLoading || (isActive && !canDeactivate)}
      onClick={handleToggle}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
        isActive ? "bg-primary" : "bg-input"
      }`}
    >
      <span
        data-state={isActive ? "checked" : "unchecked"}
        className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform ${
          isActive ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}
