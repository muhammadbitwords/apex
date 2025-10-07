"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, Car, Users, TrendingUp, Plus, LogOut, User, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"auctions" | "inspections">("auctions");

  // Mock data for auctions
  const [auctions, setAuctions] = useState([
    {
      id: 1,
      carName: "2023 Toyota Corolla GLi",
      seller: "Ahmed Khan",
      startingBid: 5500000,
      currentBid: 5950000,
      status: "active",
      endsAt: "2025-10-08T18:00:00",
      bids: 12
    },
    {
      id: 2,
      carName: "2024 Honda Civic Oriel",
      seller: "Fatima Ali",
      startingBid: 8000000,
      currentBid: 8750000,
      status: "active",
      endsAt: "2025-10-09T15:00:00",
      bids: 18
    },
    {
      id: 3,
      carName: "2022 Toyota Fortuner",
      seller: "Bilal Motors",
      startingBid: 13500000,
      currentBid: 14500000,
      status: "pending",
      endsAt: "2025-10-10T12:00:00",
      bids: 0
    }
  ]);

  // Mock data for inspection reports
  const [inspections, setInspections] = useState([
    {
      id: 1,
      carName: "2023 Kia Sportage",
      owner: "Hassan Raza",
      inspector: "Certified Auto Inspect",
      score: 196,
      status: "pending",
      submittedAt: "2025-10-05T10:30:00",
      issues: 2
    },
    {
      id: 2,
      carName: "2024 Hyundai Tucson",
      owner: "Sara Ahmed",
      inspector: "TrustAuto Inspection",
      score: 197,
      status: "pending",
      submittedAt: "2025-10-05T14:20:00",
      issues: 1
    },
    {
      id: 3,
      carName: "2023 Honda City Aspire",
      owner: "Ali Motors",
      inspector: "Certified Auto Inspect",
      score: 196,
      status: "approved",
      submittedAt: "2025-10-04T09:15:00",
      issues: 2
    },
    {
      id: 4,
      carName: "2022 Suzuki Swift",
      owner: "Usman Khan",
      inspector: "TrustAuto Inspection",
      score: 185,
      status: "rejected",
      submittedAt: "2025-10-03T16:45:00",
      issues: 8
    }
  ]);

  useEffect(() => {
    // Check authentication
    const sessionToken = localStorage.getItem("sessionToken");
    const userData = localStorage.getItem("user");

    if (!sessionToken || !userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    
    // Only allow admin
    if (parsedUser.role !== "admin") {
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

  const approveAuction = (id: number) => {
    setAuctions(auctions.map(a => 
      a.id === id ? { ...a, status: "active" } : a
    ));
  };

  const rejectAuction = (id: number) => {
    setAuctions(auctions.map(a => 
      a.id === id ? { ...a, status: "rejected" } : a
    ));
  };

  const approveInspection = (id: number) => {
    setInspections(inspections.map(i => 
      i.id === id ? { ...i, status: "approved" } : i
    ));
  };

  const rejectInspection = (id: number) => {
    setInspections(inspections.map(i => 
      i.id === id ? { ...i, status: "rejected" } : i
    ));
  };

  const formatCurrency = (amount: number) => {
    return `₨${(amount / 1000000).toFixed(2)}M`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-PK', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            <span className="text-2xl font-bold">TrustAuto Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span className="font-medium">{user?.name}</span>
              <Badge variant="destructive">Admin</Badge>
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
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Manage auctions, approve inspections, and oversee platform operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-slate-600">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Auctions</CardTitle>
              <Car className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{auctions.filter(a => a.status === "active").length}</div>
              <p className="text-xs text-slate-600">{auctions.filter(a => a.status === "pending").length} pending approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Inspections</CardTitle>
              <Clock className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inspections.filter(i => i.status === "pending").length}</div>
              <p className="text-xs text-slate-600">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₨45.2M</div>
              <p className="text-xs text-slate-600">+8% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "auctions" ? "default" : "outline"}
            onClick={() => setActiveTab("auctions")}
          >
            <Car className="h-4 w-4 mr-2" />
            Manage Auctions
          </Button>
          <Button
            variant={activeTab === "inspections" ? "default" : "outline"}
            onClick={() => setActiveTab("inspections")}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve Inspections
          </Button>
        </div>

        {/* Auctions Table */}
        {activeTab === "auctions" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Auction Management</CardTitle>
                  <CardDescription>Review and approve auction listings</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Auction
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Car</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Starting Bid</TableHead>
                    <TableHead>Current Bid</TableHead>
                    <TableHead>Bids</TableHead>
                    <TableHead>Ends At</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auctions.map((auction) => (
                    <TableRow key={auction.id}>
                      <TableCell className="font-medium">{auction.carName}</TableCell>
                      <TableCell>{auction.seller}</TableCell>
                      <TableCell>{formatCurrency(auction.startingBid)}</TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {formatCurrency(auction.currentBid)}
                      </TableCell>
                      <TableCell>{auction.bids}</TableCell>
                      <TableCell>{formatDate(auction.endsAt)}</TableCell>
                      <TableCell>
                        {auction.status === "active" && (
                          <Badge className="bg-green-500">Active</Badge>
                        )}
                        {auction.status === "pending" && (
                          <Badge className="bg-yellow-500">Pending</Badge>
                        )}
                        {auction.status === "rejected" && (
                          <Badge variant="destructive">Rejected</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {auction.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => approveAuction(auction.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => rejectAuction(auction.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Inspections Table */}
        {activeTab === "inspections" && (
          <Card>
            <CardHeader>
              <CardTitle>Inspection Report Approval</CardTitle>
              <CardDescription>Review and approve inspection reports before publishing</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Car</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Inspector</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Issues</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inspections.map((inspection) => (
                    <TableRow key={inspection.id}>
                      <TableCell className="font-medium">{inspection.carName}</TableCell>
                      <TableCell>{inspection.owner}</TableCell>
                      <TableCell>{inspection.inspector}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{inspection.score}/200</span>
                          {inspection.score >= 195 && (
                            <Badge className="bg-green-500">Excellent</Badge>
                          )}
                          {inspection.score >= 185 && inspection.score < 195 && (
                            <Badge className="bg-blue-500">Very Good</Badge>
                          )}
                          {inspection.score < 185 && (
                            <Badge className="bg-yellow-500">Good</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{inspection.issues} issues</Badge>
                      </TableCell>
                      <TableCell>{formatDate(inspection.submittedAt)}</TableCell>
                      <TableCell>
                        {inspection.status === "approved" && (
                          <Badge className="bg-green-500">Approved</Badge>
                        )}
                        {inspection.status === "pending" && (
                          <Badge className="bg-yellow-500">Pending</Badge>
                        )}
                        {inspection.status === "rejected" && (
                          <Badge variant="destructive">Rejected</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {inspection.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => approveInspection(inspection.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => rejectInspection(inspection.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
