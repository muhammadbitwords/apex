"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, CheckCircle2, AlertCircle, XCircle, Download, FileText } from "lucide-react";
import Link from "next/link";

// Mock inspection data
const inspectionData = {
  carId: 1,
  carInfo: {
    make: "Toyota",
    model: "Camry",
    year: 2022,
    vin: "1HGBH41JXMN109186"
  },
  overallScore: 195,
  inspectionDate: "2025-10-01",
  inspector: "John Smith",
  categories: [
    {
      name: "Exterior",
      score: 39,
      maxScore: 40,
      items: [
        { name: "Paint Condition", status: "pass", notes: "Excellent condition, no scratches" },
        { name: "Body Panels", status: "pass", notes: "All panels aligned properly" },
        { name: "Glass & Mirrors", status: "pass", notes: "No chips or cracks" },
        { name: "Lights & Signals", status: "pass", notes: "All functioning properly" },
        { name: "Tires & Wheels", status: "warning", notes: "Front tires at 6/32 tread depth" },
        { name: "Undercarriage", status: "pass", notes: "No rust or damage" },
        { name: "Bumpers", status: "pass", notes: "Minor scuff on rear bumper" },
        { name: "Trim & Molding", status: "pass", notes: "All intact" }
      ]
    },
    {
      name: "Interior",
      score: 38,
      maxScore: 40,
      items: [
        { name: "Seats & Upholstery", status: "pass", notes: "Clean, no tears or stains" },
        { name: "Dashboard", status: "pass", notes: "No cracks or damage" },
        { name: "Carpet & Floor Mats", status: "pass", notes: "Clean condition" },
        { name: "Door Panels", status: "pass", notes: "All switches functional" },
        { name: "Headliner", status: "pass", notes: "No sagging or stains" },
        { name: "Climate Control", status: "pass", notes: "AC and heat working perfectly" },
        { name: "Audio System", status: "pass", notes: "All speakers functional" },
        { name: "Interior Lights", status: "warning", notes: "Dome light slightly dim" }
      ]
    },
    {
      name: "Mechanical",
      score: 48,
      maxScore: 50,
      items: [
        { name: "Engine Performance", status: "pass", notes: "Smooth idle, no unusual noises" },
        { name: "Transmission", status: "pass", notes: "Shifts smoothly in all gears" },
        { name: "Brakes", status: "pass", notes: "Front pads at 70%, rear at 65%" },
        { name: "Suspension", status: "pass", notes: "No leaks, smooth operation" },
        { name: "Steering", status: "pass", notes: "Responsive, no play" },
        { name: "Exhaust System", status: "pass", notes: "No leaks or damage" },
        { name: "Cooling System", status: "pass", notes: "No leaks, proper temperature" },
        { name: "Fuel System", status: "pass", notes: "No leaks detected" },
        { name: "Drive Axles", status: "pass", notes: "No unusual noises" },
        { name: "Fluid Levels", status: "warning", notes: "Brake fluid slightly low" }
      ]
    },
    {
      name: "Electrical",
      score: 39,
      maxScore: 40,
      items: [
        { name: "Battery", status: "pass", notes: "12.6V, good condition" },
        { name: "Alternator", status: "pass", notes: "Charging properly at 14.2V" },
        { name: "Starter", status: "pass", notes: "Engages immediately" },
        { name: "Wiring", status: "pass", notes: "No exposed or damaged wires" },
        { name: "Fuses", status: "pass", notes: "All intact" },
        { name: "Power Windows", status: "pass", notes: "All functioning smoothly" },
        { name: "Power Locks", status: "pass", notes: "All doors lock/unlock properly" },
        { name: "Infotainment", status: "warning", notes: "Bluetooth occasionally disconnects" }
      ]
    },
    {
      name: "Safety",
      score: 31,
      maxScore: 30,
      items: [
        { name: "Airbags", status: "pass", notes: "No warning lights, all present" },
        { name: "Seatbelts", status: "pass", notes: "All retract and lock properly" },
        { name: "ABS System", status: "pass", notes: "Functioning correctly" },
        { name: "Traction Control", status: "pass", notes: "Engages as expected" },
        { name: "Stability Control", status: "pass", notes: "No warning lights" },
        { name: "Backup Camera", status: "pass", notes: "Clear image" },
        { name: "Blind Spot Monitor", status: "pass", notes: "Alerts functioning" }
      ]
    }
  ]
};

export default function InspectionPage() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case "fail":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pass":
        return <Badge className="bg-green-600">Pass</Badge>;
      case "warning":
        return <Badge className="bg-yellow-600">Warning</Badge>;
      case "fail":
        return <Badge className="bg-red-600">Fail</Badge>;
      default:
        return null;
    }
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
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/cars" className="text-sm font-medium hover:text-blue-600 transition-colors">Browse Cars</Link>
            <Link href="/auctions" className="text-sm font-medium hover:text-blue-600 transition-colors">Live Auctions</Link>
            <Link href="/trade-in" className="text-sm font-medium hover:text-blue-600 transition-colors">Trade-In</Link>
            <Link href="/inspection" className="text-sm font-medium text-blue-600">Inspection</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <Badge className="mb-3 bg-white/20 text-white border-white/30">
            <Shield className="h-3 w-3 mr-1" />
            200-Point Apex Inspection
          </Badge>
          <h1 className="text-5xl font-bold mb-4">Comprehensive Vehicle Inspection</h1>
          <p className="text-xl text-green-100 max-w-2xl">
            Every vehicle undergoes our rigorous 200-point inspection process, ensuring complete transparency and peace of mind.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Overall Score Card */}
          <Card className="border-2 border-green-600">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">
                    {inspectionData.carInfo.year} {inspectionData.carInfo.make} {inspectionData.carInfo.model}
                  </CardTitle>
                  <CardDescription className="text-base">
                    VIN: {inspectionData.carInfo.vin}
                  </CardDescription>
                  <div className="flex gap-4 mt-3 text-sm">
                    <span>Inspection Date: {inspectionData.inspectionDate}</span>
                    <span>Inspector: {inspectionData.inspector}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-green-600 mb-1">
                    {inspectionData.overallScore}
                  </div>
                  <div className="text-sm text-slate-600">out of 200</div>
                  <Badge className="mt-2 bg-green-600">Excellent</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex gap-3 mb-6">
                <Button className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download Full Report
                </Button>
                <Button variant="outline" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Share Report
                </Button>
              </div>
              
              {/* Category Scores */}
              <div className="grid md:grid-cols-5 gap-4">
                {inspectionData.categories.map((category) => (
                  <div key={category.name} className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {category.score}/{category.maxScore}
                    </div>
                    <div className="text-sm text-slate-600">{category.name}</div>
                    <Progress 
                      value={(category.score / category.maxScore) * 100} 
                      className="mt-2 h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Inspection Categories */}
          {inspectionData.categories.map((category) => (
            <Card key={category.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{category.name}</CardTitle>
                    <CardDescription>
                      {category.items.length} inspection points
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {category.score}/{category.maxScore}
                    </div>
                    <Progress 
                      value={(category.score / category.maxScore) * 100} 
                      className="mt-2 w-32"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.items.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="shrink-0 mt-0.5">
                        {getStatusIcon(item.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          {getStatusBadge(item.status)}
                        </div>
                        <p className="text-sm text-slate-600">{item.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Trust Badge */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex gap-4 items-start">
                <Shield className="h-12 w-12 text-blue-600 shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">
                    Trust Certified Inspection
                  </h3>
                  <p className="text-blue-700 mb-4">
                    This vehicle has passed our comprehensive 200-point Apex Inspection, covering all critical systems and components. Our certified inspectors use industry-leading diagnostic tools and follow strict protocols to ensure accuracy and transparency.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium">Certified Inspector</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium">Detailed Documentation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium">30-Day Warranty</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* What We Inspect */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What's Included in Our 200-Point Inspection</h2>
          <div className="grid md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">40</span>
              </div>
              <h3 className="font-semibold mb-2">Exterior Points</h3>
              <p className="text-sm text-slate-600">
                Paint, body, glass, lights, tires
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">40</span>
              </div>
              <h3 className="font-semibold mb-2">Interior Points</h3>
              <p className="text-sm text-slate-600">
                Seats, dashboard, controls, climate
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">50</span>
              </div>
              <h3 className="font-semibold mb-2">Mechanical Points</h3>
              <p className="text-sm text-slate-600">
                Engine, transmission, brakes, suspension
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">40</span>
              </div>
              <h3 className="font-semibold mb-2">Electrical Points</h3>
              <p className="text-sm text-slate-600">
                Battery, alternator, wiring, electronics
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">30</span>
              </div>
              <h3 className="font-semibold mb-2">Safety Points</h3>
              <p className="text-sm text-slate-600">
                Airbags, seatbelts, ABS, safety systems
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
