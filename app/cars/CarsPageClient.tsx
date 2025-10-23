"use client";

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Shield, Eye, CreditCard, MapPin, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

import { MultiSelectFilter } from "@/components/ui/MultiSelectFilter";

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
    status: "available",
    transmission: "Automatic",
    engineType: "Petrol",
    bodyType: "Sedan",
    engineCC: 1800,
    features: ["sunroof", "leather seats"]
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
    status: "available",
    transmission: "Automatic",
    engineType: "Petrol",
    bodyType: "Sedan",
    engineCC: 1800,
    features: ["navigation", "alloy wheels"]
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
    status: "available",
    transmission: "Manual",
    engineType: "Petrol",
    bodyType: "Hatchback",
    engineCC: 660,
    features: ["keyless entry"]
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
    status: "available",
    transmission: "Automatic",
    engineType: "Diesel",
    bodyType: "SUV",
    engineCC: 2800,
    features: ["4x4", "sunroof", "leather seats"]
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
    status: "available",
    transmission: "Automatic",
    engineType: "Petrol",
    bodyType: "Sedan",
    engineCC: 1500,
    features: ["alloy wheels"]
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
    status: "available",
    transmission: "Automatic",
    engineType: "Petrol",
    bodyType: "Hatchback",
    engineCC: 1000,
    features: []
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
    status: "available",
    transmission: "Automatic",
    engineType: "Petrol",
    bodyType: "Sedan",
    engineCC: 1500,
    features: ["keyless entry", "alloy wheels"]
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
    status: "available",
    transmission: "Automatic",
    engineType: "Petrol",
    bodyType: "SUV",
    engineCC: 1500,
    features: ["7-seater"]
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
    status: "available",
    transmission: "Automatic",
    engineType: "Petrol",
    bodyType: "Hatchback",
    engineCC: 1200,
    features: ["navigation"]
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
    status: "available",
    transmission: "Automatic",
    engineType: "Diesel",
    bodyType: "SUV",
    engineCC: 2800,
    features: ["4x4", "off-road kit"]
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
    status: "available",
    transmission: "Automatic",
    engineType: "Petrol",
    bodyType: "SUV",
    engineCC: 2000,
    features: ["sunroof", "panoramic roof"]
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
    status: "available",
    transmission: "Automatic",
    engineType: "Petrol",
    bodyType: "SUV",
    engineCC: 2000,
    features: ["leather seats", "ventilated seats"]
  }
];



const CarCard = React.memo(({ car, formatCurrency, handleBuyNow }: { car: any, formatCurrency: any, handleBuyNow: any }) => (
  <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
    <div className="relative">
      <Image
        src={car.image}
        alt={`${car.make} ${car.model}`}
        width={800}
        height={600}
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
      <div className="flex flex-wrap gap-2">
        {car.features.map((feature: string) => (
          <Badge key={feature} variant="secondary">{feature}</Badge>
        ))}
      </div>
    </CardContent>

    <CardFooter className="flex gap-2">
      <Link href={`/cars/${car.id}`} className="flex-1">
        <Button variant="outline" className="w-full">
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </Link>
      <Button 
        className="flex-1"
        onClick={() => handleBuyNow(car)}
      >
        <CreditCard className="h-4 w-4 mr-2" />
        Buy Now
      </Button>
    </CardFooter>
  </Card>
));

export default function CarsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    make: [],
    model: [],
    year: "all",
    condition: "all",
    location: "all",
    priceRange: [0, 30000000],
    mileageRange: [0, 200000],
    engineType: "all",
    transmission: "all",
    bodyType: "all",
    engineCC: [0, 5000],
    inspectionScore: 0,
    features: []
  });

  const [aiSearchApplied, setAiSearchApplied] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    if (params.q) {
      setSearchQuery(params.q);
    }
    if (Object.keys(params).length > 0) {
      setAiSearchApplied(true);
      const newFilters: any = { ...filters };
      for (const key in params) {
        if (key === 'make' || key === 'model' || key === 'features') {
          newFilters[key] = params[key].split(',');
        } else if (key === 'minPrice') {
          newFilters.priceRange[0] = parseInt(params[key]);
        } else if (key === 'maxPrice') {
          newFilters.priceRange[1] = parseInt(params[key]);
        } else if (key === 'minMileage') {
          newFilters.mileageRange[0] = parseInt(params[key]);
        } else if (key === 'maxMileage') {
          newFilters.mileageRange[1] = parseInt(params[key]);
        } else if (key === 'minEngineCC') {
          newFilters.engineCC[0] = parseInt(params[key]);
        } else if (key === 'maxEngineCC') {
          newFilters.engineCC[1] = parseInt(params[key]);
        } else {
          newFilters[key] = params[key];
        }
      }
      setFilters(newFilters);
    }
  }, [searchParams]);

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
    if (filters.make.length > 0 && !filters.make.includes(car.make)) return false;
    if (filters.model.length > 0 && !filters.model.includes(car.model)) return false;

    if (filters.year !== "all" && car.year.toString() !== filters.year) return false;
    if (filters.condition !== "all" && car.condition !== filters.condition) return false;
    if (filters.location !== "all" && !car.location.includes(filters.location)) return false;
    if (car.price < filters.priceRange[0] || car.price > filters.priceRange[1]) return false;
    if (car.mileage < filters.mileageRange[0] || car.mileage > filters.mileageRange[1]) return false;
    if (filters.transmission !== "all" && car.transmission !== filters.transmission) return false;
    if (filters.engineType !== "all" && car.engineType !== filters.engineType) return false;
    if (filters.bodyType !== "all" && car.bodyType !== filters.bodyType) return false;
    if (car.engineCC < filters.engineCC[0] || car.engineCC > filters.engineCC[1]) return false;
    if (car.inspectionScore < filters.inspectionScore) return false;

    if (Array.isArray(filters.features) && filters.features.length > 0) {
      // Assuming car has a features property which is an array of strings
      const carFeatures = car.features || [];
      for (const feature of filters.features) {
        if (!carFeatures.includes(feature)) {
          return false;
        }
      }
    }

    return true;
  });
  const [aiParams, setAiParams] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAiSearch = async () => {
    setLoading(true);
    setAiParams(null);
    try {
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await response.json();
      setAiParams(data);
    } catch (error) {
      console.error("Failed to fetch AI search results", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (aiParams) {
      const query = new URLSearchParams(aiParams).toString();
      router.push(`/cars?q=${searchQuery}&${query}`);
    }
  }, [aiParams, router, searchQuery]);

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

        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Search with natural language..." 
                className="pl-10 h-12 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button size="lg" className="h-12 px-8" onClick={handleAiSearch} disabled={loading}>
              {loading ? "Thinking..." : "AI Search"}
            </Button>
          </div>
        </div>

          <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            {aiSearchApplied && (
              <Card className="mb-4 bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-base">AI Search Applied</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(filters).map(([key, value]) => {
                      if (value !== 'all' && value !== 0 && (Array.isArray(value) ? value.length > 0 && value[0] !== '' : false)) {
                        return (
                          <Badge key={key} variant="secondary">
                            {key}: {Array.isArray(value) ? value.join(', ') : value}
                          </Badge>
                        )
                      }
                      return null;
                    })}
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full mt-4 text-blue-600 hover:bg-blue-100"
                    onClick={() => {
                      setAiSearchApplied(false);
                      setFilters({
                        make: "all",
                        model: "all",
                        year: "all",
                        condition: "all",
                        location: "all",
                        priceRange: [0, 30000000],
                        mileageRange: [0, 200000],
                        engineType: "all",
                        transmission: "all",
                        bodyType: "all",
                        engineCC: [0, 5000],
                        inspectionScore: 0,
                        features: []
                      });
                      router.push('/cars');
                    }}
                  >
                    Clear AI Search
                  </Button>
                </CardContent>
              </Card>
            )}
            <Card className="sticky top-24 border shadow-sm">
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3']}>
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="bg-slate-100 px-4 rounded-t-lg">Vehicle</AccordionTrigger>
                    <AccordionContent className="px-4 pt-2 space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Make</label>
                        <MultiSelectFilter
                          options={[
                            { value: "Toyota", label: "Toyota" },
                            { value: "Honda", label: "Honda" },
                            { value: "Suzuki", label: "Suzuki" },
                            { value: "Kia", label: "Kia" },
                            { value: "Hyundai", label: "Hyundai" },
                          ]}
                          value={filters.make}
                          onChange={(value) => setFilters({ ...filters, make: value })}
                          placeholder="Select Makes"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Model</label>
                        <MultiSelectFilter
                          options={[
                            { value: "Corolla GLi", label: "Corolla GLi" },
                            { value: "Civic Oriel", label: "Civic Oriel" },
                            { value: "Alto VXR", label: "Alto VXR" },
                            { value: "Fortuner", label: "Fortuner" },
                            { value: "City Aspire", label: "City Aspire" },
                            { value: "Cultus VXL", label: "Cultus VXL" },
                            { value: "Yaris ATIV", label: "Yaris ATIV" },
                            { value: "BR-V", label: "BR-V" },
                            { value: "Swift", label: "Swift" },
                            { value: "Hilux Revo", label: "Hilux Revo" },
                            { value: "Sportage", label: "Sportage" },
                            { value: "Tucson", label: "Tucson" },
                          ]}
                          value={filters.model}
                          onChange={(value) => setFilters({ ...filters, model: value })}
                          placeholder="Select Models"
                        />
                      </div>
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
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Body Type</label>
                        <Select value={filters.bodyType} onValueChange={(value) => setFilters({...filters, bodyType: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="Sedan">Sedan</SelectItem>
                            <SelectItem value="SUV">SUV</SelectItem>
                            <SelectItem value="Hatchback">Hatchback</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="bg-slate-100 px-4">Price & Mileage</AccordionTrigger>
                    <AccordionContent className="px-4 pt-2 space-y-4">
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
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Mileage: {filters.mileageRange[0].toLocaleString()} - {filters.mileageRange[1].toLocaleString()} km
                        </label>
                        <Slider
                          min={0}
                          max={200000}
                          step={1000}
                          value={filters.mileageRange}
                          onValueChange={(value) => setFilters({...filters, mileageRange: value})}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="bg-slate-100 px-4">Performance</AccordionTrigger>
                    <AccordionContent className="px-4 pt-2 space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Engine Type</label>
                        <Select value={filters.engineType} onValueChange={(value) => setFilters({...filters, engineType: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="Petrol">Petrol</SelectItem>
                            <SelectItem value="Diesel">Diesel</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                            <SelectItem value="Electric">Electric</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Transmission</label>
                        <Select value={filters.transmission} onValueChange={(value) => setFilters({...filters, transmission: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="Automatic">Automatic</SelectItem>
                            <SelectItem value="Manual">Manual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Engine: {filters.engineCC[0].toLocaleString()} - {filters.engineCC[1].toLocaleString()} CC
                        </label>
                        <Slider
                          min={0}
                          max={5000}
                          step={100}
                          value={filters.engineCC}
                          onValueChange={(value) => setFilters({...filters, engineCC: value})}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger className="bg-slate-100 px-4 rounded-b-lg">Condition & Location</AccordionTrigger>
                    <AccordionContent className="px-4 pt-2 space-y-4">
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
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full text-lg"
                  onClick={() => setFilters({
                    make: [],
                    model: [],
                    year: "all",
                    condition: "all",
                    location: "all",
                    priceRange: [0, 30000000],
                    mileageRange: [0, 200000],
                    engineType: "all",
                    transmission: "all",
                    bodyType: "all",
                    engineCC: [0, 5000],
                    inspectionScore: 0,
                    features: []
                  })}
                >
                  Reset Filters
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Cars Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-slate-600">{filteredCars.length} vehicles found</p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} formatCurrency={formatCurrency} handleBuyNow={handleBuyNow} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}