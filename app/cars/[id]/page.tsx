"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, MapPin, CreditCard, Calendar, Gauge, Car, Settings, Palette } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

// This is a mock data array. In a real application, you would fetch this data from an API.
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
    engineCC: 1800
  },
  // ... (rest of the mockCars array)
];

export default function CarDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [car, setCar] = useState<any>(null);

  useEffect(() => {
    if (params.id) {
      const carId = parseInt(params.id as string);
      const foundCar = mockCars.find((c) => c.id === carId);
      setCar(foundCar);
    }
  }, [params.id]);

  if (!car) {
    return <div>Loading...</div>;
  }

  const formatCurrency = (amount: number) => {
    return `₨${(amount / 1000000).toFixed(2)}M`;
  };

  const handleBuyNow = (car: any) => {
    const params = new URLSearchParams({
      carId: car.id.toString(),
      amount: car.price.toString(),
      carName: `${car.year} ${car.make} ${car.model}`,
      type: "purchase"
    });
    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-800">TrustAuto</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/cars" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Browse Cars</Link>
              <Link href="/auctions" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Live Auctions</Link>
              <Link href="/trade-in" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Trade-In</Link>
            </nav>
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column: Image and Specs */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="overflow-hidden">
              <Image
                src={car.image}
                alt={`${car.make} ${car.model}`}
                width={1200}
                height={800}
                className="w-full h-auto object-cover"
              />
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Make</span>
                    <span className="font-semibold text-lg">{car.make}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Model</span>
                    <span className="font-semibold text-lg">{car.model}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Year</span>
                    <span className="font-semibold text-lg">{car.year}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Mileage</span>
                    <span className="font-semibold text-lg">{car.mileage.toLocaleString()} km</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Engine Type</span>
                    <span className="font-semibold text-lg">{car.engineType}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Engine CC</span>
                    <span className="font-semibold text-lg">{car.engineCC}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Transmission</span>
                    <span className="font-semibold text-lg">{car.transmission}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Body Type</span>
                    <span className="font-semibold text-lg">{car.bodyType}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Condition</span>
                    <span className="font-semibold text-lg">{car.condition}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Price and Seller */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="sticky top-24">
              <CardHeader>
                <p className="text-sm text-gray-500">Price</p>
                <CardTitle className="text-5xl font-extrabold text-blue-600">{formatCurrency(car.price)}</CardTitle>
                <h1 className="text-2xl font-bold text-gray-800 pt-2">{car.year} {car.make} {car.model}</h1>
                <CardDescription className="flex items-center gap-2 pt-1">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {car.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="lg" className="w-full text-lg py-6" onClick={() => handleBuyNow(car)}>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Buy Now
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div>
                  <CardTitle className="text-xl font-bold">TrustAuto Certified</CardTitle>
                  <CardDescription>Member since 2023</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Contact Seller
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
