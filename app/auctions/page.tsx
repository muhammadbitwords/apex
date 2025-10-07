"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock, TrendingUp, Users, Wifi, WifiOff, Lock, User } from "lucide-react";
import Link from "next/link";
import { useSocket } from "@/lib/socket-context";
import { useRouter } from "next/navigation";

interface Auction {
  id: number;
  carName: string;
  year: number;
  image: string;
  currentBid: number;
  reservePrice: number;
  startingBid: number;
  bidCount: number;
  endsAt: string;
  location: string;
  mileage: string;
  condition: string;
  inspectionScore: number;
}

export default function AuctionsPage() {
  const router = useRouter();
  const { socket, isConnected, isAuthenticated, user } = useSocket();
  const [auctions, setAuctions] = useState<Auction[]>([
    {
      id: 1,
      carName: "2022 Toyota Corolla Altis Grande",
      year: 2022,
      image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop",
      currentBid: 6250000,
      reservePrice: 6500000,
      startingBid: 5800000,
      bidCount: 23,
      endsAt: "2025-10-07T18:00:00",
      location: "Lahore",
      mileage: "35,000 km",
      condition: "Excellent",
      inspectionScore: 198
    },
    {
      id: 2,
      carName: "2023 Honda Civic Turbo",
      year: 2023,
      image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&auto=format&fit=crop",
      currentBid: 8950000,
      reservePrice: 9200000,
      startingBid: 8500000,
      bidCount: 31,
      endsAt: "2025-10-07T20:30:00",
      location: "Karachi",
      mileage: "18,000 km",
      condition: "Like New",
      inspectionScore: 199
    },
    {
      id: 3,
      carName: "2022 Kia Sportage AWD",
      year: 2022,
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop",
      currentBid: 9750000,
      reservePrice: 10000000,
      startingBid: 9200000,
      bidCount: 18,
      endsAt: "2025-10-08T15:00:00",
      location: "Islamabad",
      mileage: "42,000 km",
      condition: "Very Good",
      inspectionScore: 195
    },
    {
      id: 4,
      carName: "2021 Toyota Land Cruiser V8",
      year: 2021,
      image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&auto=format&fit=crop",
      currentBid: 28500000,
      reservePrice: 30000000,
      startingBid: 27000000,
      bidCount: 45,
      endsAt: "2025-10-08T19:00:00",
      location: "Rawalpindi",
      mileage: "28,000 km",
      condition: "Excellent",
      inspectionScore: 197
    },
    {
      id: 5,
      carName: "2023 Hyundai Tucson Ultimate",
      year: 2023,
      image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop",
      currentBid: 10250000,
      reservePrice: 10800000,
      startingBid: 9800000,
      bidCount: 27,
      endsAt: "2025-10-09T12:00:00",
      location: "Faisalabad",
      mileage: "12,000 km",
      condition: "Like New",
      inspectionScore: 199
    },
    {
      id: 6,
      carName: "2023 MG HS",
      year: 2023,
      image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop",
      currentBid: 7850000,
      reservePrice: 8200000,
      startingBid: 7500000,
      bidCount: 15,
      endsAt: "2025-10-09T16:30:00",
      location: "Multan",
      mileage: "8,000 km",
      condition: "Excellent",
      inspectionScore: 196
    }
  ]);

  const [timeLeft, setTimeLeft] = useState<{ [key: number]: string }>({});

  // WebSocket event listeners
  useEffect(() => {
    if (!socket) return;

    // Join all auction rooms
    auctions.forEach(auction => {
      socket.emit('join-auction', auction.id);
    });

    // Listen for bid updates
    socket.on('bid-placed', (data) => {
      console.log('Bid placed:', data);
      setAuctions(prev => prev.map(auction => 
        auction.id === data.auctionId 
          ? { ...auction, currentBid: data.currentBid, bidCount: data.bidCount }
          : auction
      ));
    });

    // Listen for auction status changes
    socket.on('auction-status-changed', (data) => {
      console.log('Auction status changed:', data);
    });

    // Listen for auction end
    socket.on('auction-ended', (data) => {
      console.log('Auction ended:', data);
    });

    return () => {
      // Leave all auction rooms on unmount
      auctions.forEach(auction => {
        socket.emit('leave-auction', auction.id);
      });
      socket.off('bid-placed');
      socket.off('auction-status-changed');
      socket.off('auction-ended');
    };
  }, [socket, auctions]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft: { [key: number]: string } = {};
      
      auctions.forEach(auction => {
        const now = new Date().getTime();
        const end = new Date(auction.endsAt).getTime();
        const distance = end - now;

        if (distance < 0) {
          newTimeLeft[auction.id] = "ENDED";
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          if (days > 0) {
            newTimeLeft[auction.id] = `${days}d ${hours}h ${minutes}m`;
          } else if (hours > 0) {
            newTimeLeft[auction.id] = `${hours}h ${minutes}m ${seconds}s`;
          } else {
            newTimeLeft[auction.id] = `${minutes}m ${seconds}s`;
          }
        }
      });

      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [auctions]);

  const formatCurrency = (amount: number) => {
    return `₨${(amount / 1000000).toFixed(2)}M`;
  };

  const placeBid = (auctionId: number, amount: number) => {
    if (!socket) {
      alert("WebSocket not connected. Please refresh the page.");
      return;
    }

    if (!isAuthenticated) {
      alert("You must be logged in to place bids. Redirecting to login...");
      router.push("/login");
      return;
    }

    socket.emit('place-bid', {
      auctionId,
      bidAmount: amount,
    });
  };

  const handleQuickBid = (auction: Auction, increment: number) => {
    const newBid = auction.currentBid + increment;
    placeBid(auction.id, newBid);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">TrustAuto</span>
          </Link>
          <div className="flex items-center gap-4">
            {/* WebSocket Status Indicator */}
            <div className="flex items-center gap-2 text-sm">
              {isConnected ? (
                <>
                  <Wifi className="h-4 w-4 text-green-600" />
                  <span className="text-green-600 font-medium">Live</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-600" />
                  <span className="text-red-600 font-medium">Offline</span>
                </>
              )}
            </div>

            {/* Authentication Status */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-lg">
                <User className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">{user.name}</span>
                <Badge className="bg-green-600 text-white text-xs">{user.role}</Badge>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg">
                <Lock className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-amber-700 font-medium">Guest Mode</span>
              </div>
            )}

            <nav className="flex gap-6">
              <Link href="/cars" className="text-slate-600 hover:text-slate-900">Browse Cars</Link>
              <Link href="/trade-in" className="text-slate-600 hover:text-slate-900">Trade-In</Link>
              <Link href="/inspection" className="text-slate-600 hover:text-slate-900">Inspection</Link>
            </nav>
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Live Auctions</h1>
              <p className="text-slate-600">Real-time bidding on verified vehicles</p>
            </div>
            {isConnected && (
              <Badge className="bg-green-500 text-white px-4 py-2">
                <Wifi className="h-4 w-4 mr-2" />
                Real-Time Updates Active
              </Badge>
            )}
          </div>

          {/* Authentication Notice */}
          {!isAuthenticated && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Login Required for Bidding</p>
                  <p className="text-sm text-blue-700 mt-1">
                    You're browsing as a guest. To place bids, please{" "}
                    <Link href="/login" className="underline font-medium">sign in</Link> or{" "}
                    <Link href="/register" className="underline font-medium">create an account</Link>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Active Auctions</p>
                    <p className="text-2xl font-bold">{auctions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total Bids</p>
                    <p className="text-2xl font-bold">{auctions.reduce((sum, a) => sum + a.bidCount, 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Ending Soon</p>
                    <p className="text-2xl font-bold">2</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Auctions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <Card key={auction.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={auction.image}
                  alt={auction.carName}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-4 right-4 bg-white text-slate-900">
                  {auction.inspectionScore}/200
                </Badge>
                {isConnected && (
                  <Badge className="absolute top-4 left-4 bg-green-500 text-white animate-pulse">
                    <Wifi className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                )}
              </div>

              <CardHeader>
                <CardTitle className="text-xl">{auction.carName}</CardTitle>
                <CardDescription className="flex items-center gap-4 text-sm">
                  <span>📍 {auction.location}</span>
                  <span>🚗 {auction.mileage}</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Current Bid */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-slate-600 mb-1">Current Bid</p>
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(auction.currentBid)}</p>
                  <p className="text-xs text-slate-500 mt-1">{auction.bidCount} bids</p>
                </div>

                {/* Reserve Price */}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Reserve Price:</span>
                  <span className="font-semibold">{formatCurrency(auction.reservePrice)}</span>
                </div>

                {/* Time Left */}
                <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-600" />
                    <span className="text-sm text-slate-600">Time Left:</span>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {timeLeft[auction.id] || "Loading..."}
                  </span>
                </div>

                {/* Quick Bid Buttons */}
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">Quick Bid:</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickBid(auction, 50000)}
                      disabled={!isConnected || !isAuthenticated}
                    >
                      +₨50K
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickBid(auction, 100000)}
                      disabled={!isConnected || !isAuthenticated}
                    >
                      +₨100K
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickBid(auction, 250000)}
                      disabled={!isConnected || !isAuthenticated}
                    >
                      +₨250K
                    </Button>
                  </div>
                </div>

                {/* Place Bid Button */}
                <Button 
                  className="w-full" 
                  size="lg" 
                  disabled={!isConnected || !isAuthenticated}
                  onClick={() => !isAuthenticated && router.push("/login")}
                >
                  {!isAuthenticated ? (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Login to Bid
                    </>
                  ) : !isConnected ? (
                    "Connecting..."
                  ) : (
                    "Place Custom Bid"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
