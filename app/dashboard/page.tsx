"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Car, DollarSign, TrendingUp, Plus, LogOut, User } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const sessionToken = localStorage.getItem("sessionToken");
    const userData = localStorage.getItem("user");

    if (!sessionToken || !userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    
    // Only allow sellers and dealers
    if (parsedUser.role !== "seller" && parsedUser.role !== "dealer") {
      router.push("/");
      return;
    }

    setUser(parsedUser);
    setLoading(false);
  }, [router]);

  const handleLogout = async () => {
    const sessionToken = localStorage.getItem("sessionToken");
    
    if (sessionToken) {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionToken }),
      });
    }

    localStorage.removeItem("sessionToken");
    localStorage.removeItem("user");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">TrustAuto</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span className="font-medium">{user?.name}</span>
              <span className="text-slate-500">({user?.role})</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-slate-600">
            {user?.role === "dealer" 
              ? `Manage your dealership: ${user?.businessName}`
              : "Manage your car listings and sales"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Car className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-slate-600">No active listings yet</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-slate-600">Views on your listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₨0</div>
              <p className="text-xs text-slate-600">Revenue generated</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Bids</CardTitle>
              <Car className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-slate-600">Bids awaiting response</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with selling your cars</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button className="h-24 flex flex-col gap-2" variant="outline">
                <Plus className="h-6 w-6" />
                <span>Add New Listing</span>
              </Button>
              <Button className="h-24 flex flex-col gap-2" variant="outline" asChild>
                <Link href="/auctions">
                  <Car className="h-6 w-6" />
                  <span>View Live Auctions</span>
                </Link>
              </Button>
              <Button className="h-24 flex flex-col gap-2" variant="outline" asChild>
                <Link href="/trade-in">
                  <DollarSign className="h-6 w-6" />
                  <span>Get Trade-In Value</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* My Listings */}
        <Card>
          <CardHeader>
            <CardTitle>My Listings</CardTitle>
            <CardDescription>Manage your active car listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Car className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
              <p className="text-slate-600 mb-4">Start by adding your first car listing</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Car
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
