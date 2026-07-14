import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";

export const metadata = {
  title: "Dashboard - Ecom Site",
  description: "Overview of your e-commerce platform.",
};

export default function DashboardPage() {
  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors delay-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors delay-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors delay-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 since last hour</p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for Data Table / Charts */}
      <div className="mt-8 grid gap-4 lg:grid-cols-2 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Card className="col-span-1 h-[400px] flex items-center justify-center bg-card/50 border-dashed border-2">
          <span className="text-muted-foreground">Revenue Chart Placeholder</span>
        </Card>
        <Card className="col-span-1 h-[400px] flex items-center justify-center bg-card/50 border-dashed border-2">
          <span className="text-muted-foreground">Recent Activity Placeholder</span>
        </Card>
      </div>
    </div>
  );
}
