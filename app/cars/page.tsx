"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Shield, Heart, Eye, CheckCircle2, MapPin, CreditCard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Pakistani car market data
const mockCars = [
  {
    id: 1,
    make: "Toyota",
    model: "Corolla GLi",
    year: 2023,
    price: 5950000,
    mileage: 12000,
    condition: "Excellent",
    inspectionScore: 197,
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop",
    location: "Karachi, Sindh",
    status: "available"
  },
  {
    id: 2,
    make: "Honda",
    model: "Civic Oriel",
    year: 2024,
    price: 8750000,
    mileage: 5000,
    condition: "Excellent",
    inspectionScore: 199,
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&h=600&fit=crop",
    location: "Lahore, Punjab",
    status: "available"
  },
  {
    id: 3,
    make: "Suzuki",
    model: "Alto VXR",
    year: 2023,
    price: 2350000,
    mileage: 18000,
    condition: "Very Good",
    inspectionScore: 189,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
    location: "Islamabad",
    status: "available"
  },
  {
    id: 4,
    make: "Toyota",
    model: "Fortuner",
    year: 2022,
    price: 14500000,
    mileage: 25000,
    condition: "Excellent",
    inspectionScore: 194,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop",
    location: "Rawalpindi, Punjab",
    status: "available"
  },
  {
    id: 5,
    make: "Honda",
    model: "City Aspire",
    year: 2023,
    price: 4850000,
    mileage: 8000,
    condition: "Excellent",
    inspectionScore: 196,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop",
    location: "Faisalabad, Punjab",
    status: "available"
  },
  {
    id: 6,
    make: "Suzuki",
    model: "Cultus VXL",
    year: 2024,
    price: 3650000,
    mileage: 3000,
    condition: "Excellent",
    inspectionScore: 198,
    image: "https://images.unsplash.com/photo-1555626906-fcf10d6851b4?w=800&h=600&fit=crop",
    location: "Multan, Punjab",
    status: "available"
  },
  {
    id: 7,
    make: "Toyota",
    model: "Yaris ATIV",
    year: 2023,
    price: 4250000,
    mileage: 15000,
    condition: "Very Good",
    inspectionScore: 192,
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop",
    location: "Peshawar, KPK",
    status: "available"
  },
  {
    id: 8,
    make: "Honda",
    model: "BR-V",
    year: 2022,
    price: 5450000,
    mileage: 22000,
    condition: "Very Good",
    inspectionScore: 188,
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop",
    location: "Sialkot, Punjab",
    status: "available"
  },
  {
    id: 9,
    make: "Suzuki",
    model: "Swift",
    year: 2023,
    price: 3950000,
    mileage: 9000,
    condition: "Excellent",
    inspectionScore: 195,
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop",
    location: "Gujranwala, Punjab",
    status: "available"
  },
  {
    id: 10,
    make: "Toyota",
    model: "Hilux Revo",
    year: 2021,
    price: 11500000,
    mileage: 35000,
    condition: "Very Good",
    inspectionScore: 190,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop",
    location: "Quetta, Balochistan",
    status: "available"
  },
  {
    id: 11,
    make: "Kia",
    model: "Sportage",
    year: 2023,
    price: 9850000,
    mileage: 7000,
    condition: "Excellent",
    inspectionScore: 197,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop",
    location: "Hyderabad, Sindh",
    status: "available"
  },
  {
    id: 12,
    make: "Hyundai",
    model: "Tucson",
    year: 2024,
    price: 10250000,
    mileage: 2000,
    condition: "Excellent",
    inspectionScore: 199,
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop",
    location: "Islamabad",
    status: "available"
  }
];

export default function CarsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    make: "all",
    year: "all",
    condition: "all",
    location: "all",
    priceRange: [0, 30000000],
    inspectionScore: 0
  });

  const formatCurrency = (amount: number) => {
    return `₨${(amount / 1000000).toFixed(2)}M`;
  };

  const handleBuyNow = (car: any) => {
    // Check if user is logged in
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      alert("Please login to purchase a vehicle");
      router.push("/login");
      return;
    }

    // Redirect to checkout page
    const params = new URLSearchParams({
      carId: car.id.toString(),
      amount: car.price.toString(),
      carName: `${car.year} ${car.make} ${car.model}`,
      type: "purchase"
    });
    router.push(`/checkout?${params.toString()}`);
  };

  const filteredCars = mockCars.filter(car => {
    if (filters.make !== "all" && car.make !== filters.make) return false;
    if (filters.year !== "all" && car.year.toString() !== filters.year) return false;
    if (filters.condition !== "all" && car.condition !== filters.condition) return false;
    if (filters.location !== "all" && !car.location.includes(filters.location)) return false;
    if (car.price < filters.priceRange[0] || car.price > filters.priceRange[1]) return false;
    if (car.inspectionScore < filters.inspectionScore) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">TrustAuto</span>
          </Link>
          <nav className="flex gap-6">
            <Link href="/auctions" className="text-slate-600 hover:text-slate-900">Live Auctions</Link>
            <Link href="/trade-in" className="text-slate-600 hover:text-slate-900">Trade-In</Link>
            <Link href="/inspection" className="text-slate-600 hover:text-slate-900">Inspection</Link>
          </nav>
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Browse Cars</h1>
          <p className="text-slate-600">Find your perfect vehicle from our verified inventory</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Make Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Make</label>
                  <Select value={filters.make} onValueChange={(value) => setFilters({...filters, make: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Makes</SelectItem>
                      <SelectItem value="Toyota">Toyota</SelectItem>
                      <SelectItem value="Honda">Honda</SelectItem>
                      <SelectItem value="Suzuki">Suzuki</SelectItem>
                      <SelectItem value="Kia">Kia</SelectItem>
                      <SelectItem value="Hyundai">Hyundai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Year Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Year</label>
                  <Select value={filters.year} onValueChange={(value) => setFilters({...filters, year: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Condition Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Condition</label>
                  <Select value={filters.condition} onValueChange={(value) => setFilters({...filters, condition: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Conditions</SelectItem>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Very Good">Very Good</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Select value={filters.location} onValueChange={(value) => setFilters({...filters, location: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      <SelectItem value="Karachi">Karachi</SelectItem>
                      <SelectItem value="Lahore">Lahore</SelectItem>
                      <SelectItem value="Islamabad">Islamabad</SelectItem>
                      <SelectItem value="Rawalpindi">Rawalpindi</SelectItem>
                      <SelectItem value="Faisalabad">Faisalabad</SelectItem>
                      <SelectItem value="Multan">Multan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Price Range: {formatCurrency(filters.priceRange[0])} - {formatCurrency(filters.priceRange[1])}
                  </label>
                  <Slider
                    min={0}
                    max={30000000}
                    step={500000}
                    value={filters.priceRange}
                    onValueChange={(value) => setFilters({...filters, priceRange: value})}
                  />
                </div>

                {/* Inspection Score */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Min Inspection Score: {filters.inspectionScore}/200
                  </label>
                  <Slider
                    min={0}
                    max={200}
                    step={10}
                    value={[filters.inspectionScore]}
                    onValueChange={(value) => setFilters({...filters, inspectionScore: value[0]})}
                  />
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setFilters({
                    make: "all",
                    year: "all",
                    condition: "all",
                    location: "all",
                    priceRange: [0, 30000000],
                    inspectionScore: 0
                  })}
                >
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Cars Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-slate-600">{filteredCars.length} vehicles found</p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={car.image}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-4 right-4 bg-white text-slate-900">
                      {car.inspectionScore}/200
                    </Badge>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl">
                      {car.year} {car.make} {car.model}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {car.location}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Mileage:</span>
                      <span className="font-semibold">{car.mileage.toLocaleString()} km</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Condition:</span>
                      <Badge variant="outline">{car.condition}</Badge>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-3xl font-bold text-blue-600">{formatCurrency(car.price)}</p>
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={() => handleBuyNow(car)}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Buy Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
