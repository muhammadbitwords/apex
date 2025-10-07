"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, TrendingUp, Brain, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

export default function TradeInPage() {
  const [step, setStep] = useState<"form" | "analyzing" | "results">("form");
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    mileage: "",
    condition: "",
    city: ""
  });
  const [valuation, setValuation] = useState({
    offerAmount: 0,
    marketValue: 0,
    competitorAverage: 0,
    confidence: 0,
    comparableListings: 0,
    marketTrend: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("analyzing");
    
    // Simulate AI analysis
    setTimeout(() => {
      // Calculate valuation based on form data
      const baseValues: { [key: string]: number } = {
        "Toyota Corolla": 5500000,
        "Honda Civic": 8000000,
        "Suzuki Alto": 2200000,
        "Toyota Fortuner": 14000000,
        "Honda City": 4500000,
        "Kia Sportage": 9000000,
        "Hyundai Tucson": 10000000
      };
      
      const carKey = `${formData.make} ${formData.model}`;
      let baseValue = baseValues[carKey] || 5000000;
      
      // Adjust for year
      const yearAdjustment = (parseInt(formData.year) - 2020) * 0.05;
      baseValue = baseValue * (1 + yearAdjustment);
      
      // Adjust for mileage
      const mileageAdjustment = Math.max(0, 1 - (parseInt(formData.mileage) / 100000) * 0.2);
      baseValue = baseValue * mileageAdjustment;
      
      // Adjust for condition
      const conditionMultipliers: { [key: string]: number } = {
        "excellent": 1.0,
        "very-good": 0.95,
        "good": 0.90,
        "fair": 0.80
      };
      baseValue = baseValue * (conditionMultipliers[formData.condition] || 0.9);
      
      setValuation({
        offerAmount: Math.round(baseValue),
        marketValue: Math.round(baseValue * 1.08),
        competitorAverage: Math.round(baseValue * 0.92),
        confidence: Math.floor(92 + Math.random() * 6),
        comparableListings: Math.floor(15 + Math.random() * 25),
        marketTrend: Math.random() > 0.5 ? "increasing" : "stable"
      });
      
      setStep("results");
    }, 3000);
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
            <Link href="/trade-in" className="text-sm font-medium text-blue-600">Trade-In</Link>
            <Link href="/inspection" className="text-sm font-medium hover:text-blue-600 transition-colors">Inspection</Link>
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

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="outline">
            <Brain className="h-3 w-3 mr-1" />
            AI-Powered Valuation - Pakistan
          </Badge>
          <h1 className="text-5xl font-bold mb-4">Get Your Car's Value Instantly</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our AI analyzes market data, competitor prices, and inspection reports to give you an accurate, fair valuation in seconds.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {step === "form" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Tell Us About Your Car</CardTitle>
                <CardDescription>Provide details for an accurate valuation</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Make</label>
                      <Select 
                        value={formData.make} 
                        onValueChange={(value) => setFormData({...formData, make: value})}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select make" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Toyota">Toyota</SelectItem>
                          <SelectItem value="Honda">Honda</SelectItem>
                          <SelectItem value="Suzuki">Suzuki</SelectItem>
                          <SelectItem value="Kia">Kia</SelectItem>
                          <SelectItem value="Hyundai">Hyundai</SelectItem>
                          <SelectItem value="MG">MG</SelectItem>
                          <SelectItem value="Changan">Changan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Model</label>
                      <Select 
                        value={formData.model} 
                        onValueChange={(value) => setFormData({...formData, model: value})}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Corolla">Corolla</SelectItem>
                          <SelectItem value="Civic">Civic</SelectItem>
                          <SelectItem value="Alto">Alto</SelectItem>
                          <SelectItem value="Fortuner">Fortuner</SelectItem>
                          <SelectItem value="City">City</SelectItem>
                          <SelectItem value="Sportage">Sportage</SelectItem>
                          <SelectItem value="Tucson">Tucson</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Year</label>
                      <Select 
                        value={formData.year} 
                        onValueChange={(value) => setFormData({...formData, year: value})}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2023">2023</SelectItem>
                          <SelectItem value="2022">2022</SelectItem>
                          <SelectItem value="2021">2021</SelectItem>
                          <SelectItem value="2020">2020</SelectItem>
                          <SelectItem value="2019">2019</SelectItem>
                          <SelectItem value="2018">2018</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Mileage (km)</label>
                      <Input 
                        type="number" 
                        placeholder="e.g., 25000"
                        value={formData.mileage}
                        onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Condition</label>
                      <Select 
                        value={formData.condition} 
                        onValueChange={(value) => setFormData({...formData, condition: value})}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="very-good">Very Good</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">City</label>
                      <Select 
                        value={formData.city} 
                        onValueChange={(value) => setFormData({...formData, city: value})}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="karachi">Karachi</SelectItem>
                          <SelectItem value="lahore">Lahore</SelectItem>
                          <SelectItem value="islamabad">Islamabad</SelectItem>
                          <SelectItem value="rawalpindi">Rawalpindi</SelectItem>
                          <SelectItem value="faisalabad">Faisalabad</SelectItem>
                          <SelectItem value="multan">Multan</SelectItem>
                          <SelectItem value="peshawar">Peshawar</SelectItem>
                          <SelectItem value="quetta">Quetta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Get AI Valuation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {step === "analyzing" && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-6">
                  <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <Brain className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Analyzing Your Vehicle</h2>
                    <p className="text-slate-600">Our AI is processing market data and comparable listings...</p>
                  </div>
                  <Progress value={66} className="max-w-md mx-auto" />
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Analyzing market trends in Pakistan
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Comparing with similar listings
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      Calculating final valuation
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === "results" && (
            <div className="space-y-6">
              <Card className="border-2 border-blue-600">
                <CardHeader className="text-center pb-4">
                  <Badge className="mx-auto mb-4 bg-green-600">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Valuation Complete
                  </Badge>
                  <CardTitle className="text-3xl mb-2">
                    {formData.year} {formData.make} {formData.model}
                  </CardTitle>
                  <CardDescription>Based on AI analysis of {valuation.comparableListings} comparable listings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center py-6 bg-blue-50 rounded-lg">
                    <div className="text-sm text-slate-600 mb-2">Your Trade-In Offer</div>
                    <div className="text-5xl font-bold text-blue-600 mb-2">
                      ₨{(valuation.offerAmount / 1000000).toFixed(2)}M
                    </div>
                    <div className="text-sm text-slate-600">
                      {valuation.confidence}% confidence • Market trend: {valuation.marketTrend}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <div className="text-sm text-slate-600 mb-1">Market Value</div>
                      <div className="text-xl font-bold">₨{(valuation.marketValue / 1000000).toFixed(2)}M</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <div className="text-sm text-slate-600 mb-1">Competitor Avg</div>
                      <div className="text-xl font-bold">₨{(valuation.competitorAverage / 1000000).toFixed(2)}M</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <div className="text-sm text-slate-600 mb-1">Comparable Cars</div>
                      <div className="text-xl font-bold">{valuation.comparableListings}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold">How We Calculated This</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between p-3 bg-slate-50 rounded">
                        <span>Base market value</span>
                        <span className="font-medium">₨{(valuation.marketValue / 1000000).toFixed(2)}M</span>
                      </div>
                      <div className="flex justify-between p-3 bg-slate-50 rounded">
                        <span>Mileage adjustment</span>
                        <span className="font-medium text-orange-600">-₨{((valuation.marketValue - valuation.offerAmount) / 2 / 1000000).toFixed(2)}M</span>
                      </div>
                      <div className="flex justify-between p-3 bg-slate-50 rounded">
                        <span>Condition factor</span>
                        <span className="font-medium text-orange-600">-₨{((valuation.marketValue - valuation.offerAmount) / 2 / 1000000).toFixed(2)}M</span>
                      </div>
                      <div className="flex justify-between p-3 bg-blue-50 rounded font-semibold">
                        <span>Final offer</span>
                        <span className="text-blue-600">₨{(valuation.offerAmount / 1000000).toFixed(2)}M</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button size="lg" className="flex-1">
                      Accept Offer
                    </Button>
                    <Button size="lg" variant="outline" className="flex-1" onClick={() => setStep("form")}>
                      New Valuation
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Why Our AI Valuations Are Accurate</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                      <Brain className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Self-Learning Algorithm</h4>
                      <p className="text-sm text-slate-600">
                        Our AI continuously learns from actual sale prices vs. proposed valuations, improving accuracy with every transaction across Pakistan.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Real-Time Market Data</h4>
                      <p className="text-sm text-slate-600">
                        We analyze thousands of listings daily from across Pakistan to understand current market trends and pricing.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Inspection Integration</h4>
                      <p className="text-sm text-slate-600">
                        Valuations factor in our 200-point inspection scores for the most accurate condition-based pricing.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* How It Works */}
        {step === "form" && (
          <Card className="max-w-4xl mx-auto mt-12">
            <CardHeader>
              <CardTitle className="text-2xl">How AI Trade-In Works</CardTitle>
              <CardDescription>Get your car's value in 3 simple steps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-blue-600">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Enter Details</h3>
                  <p className="text-sm text-slate-600">
                    Provide basic information about your vehicle including make, model, year, and condition
                  </p>
                </div>
                <div className="text-center">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-blue-600">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">AI Analysis</h3>
                  <p className="text-sm text-slate-600">
                    Our AI analyzes market data, competitor prices, and comparable listings in real-time
                  </p>
                </div>
                <div className="text-center">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-blue-600">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Get Instant Offer</h3>
                  <p className="text-sm text-slate-600">
                    Receive an accurate valuation with detailed breakdown and accept the offer instantly
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
