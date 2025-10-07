"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Shield, Gavel, TrendingUp, Star, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">TrustAuto</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/cars" className="text-sm font-medium hover:text-blue-600 transition-colors">Browse Cars</Link>
            <Link href="/auctions" className="text-sm font-medium hover:text-blue-600 transition-colors">Live Auctions</Link>
            <Link href="/trade-in" className="text-sm font-medium hover:text-blue-600 transition-colors">Trade-In</Link>
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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-4" variant="outline">
          <Shield className="h-3 w-3 mr-1" />
          Certified Marketplace - Pakistan
        </Badge>
        <h1 className="text-6xl font-bold mb-6 tracking-tight">
          Buy & Sell Cars with
          <span className="text-blue-600"> Complete Trust</span>
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Every vehicle backed by our 200-Point Apex Inspection. Live auctions, AI-powered trade-ins, and transparent pricing across Pakistan.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Search by make, model, or keyword..." 
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button size="lg" className="h-12 px-8">Search</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">25,000+</div>
            <div className="text-sm text-slate-600">Cars Listed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">98%</div>
            <div className="text-sm text-slate-600">Trust Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">24/7</div>
            <div className="text-sm text-slate-600">Live Auctions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">₨500M+</div>
            <div className="text-sm text-slate-600">Trade-In Value</div>
          </div>
        </div>
      </section>

      {/* Featured Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Why Choose TrustAuto?</h2>
          <p className="text-lg text-slate-600">Built on transparency, powered by technology</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* 200-Point Inspection */}
          <Card className="border-2 hover:border-blue-600 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>200-Point Apex Inspection</CardTitle>
              <CardDescription>
                Every vehicle undergoes our comprehensive 200-point inspection covering exterior, interior, mechanical, electrical, and safety systems.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/inspection">View Sample Report</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Live Auctions */}
          <Card className="border-2 hover:border-blue-600 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Gavel className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Live Auctions</CardTitle>
              <CardDescription>
                Participate in real-time bidding with countdown timers. Fair, transparent, and exciting way to find your perfect car at the best price.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/auctions">Browse Auctions</Link>
              </Button>
            </CardContent>
          </Card>

          {/* AI Trade-In */}
          <Card className="border-2 hover:border-blue-600 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>AI-Powered Trade-In</CardTitle>
              <CardDescription>
                Get instant, accurate valuations powered by AI. Our system analyzes market data, competitor prices, and inspection reports in real-time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/trade-in">Get Valuation</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-slate-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="h-16 w-16 mx-auto mb-6 text-blue-400" />
            <h2 className="text-4xl font-bold mb-6">Trust - Our Main Promise</h2>
            <p className="text-lg text-slate-300 mb-8">
              Trust is at the heart of everything we do. Every transaction is protected, every inspection is thorough, and every price is fair. We've built our reputation on transparency and reliability across Pakistan.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div>
                <Star className="h-8 w-8 mx-auto mb-3 text-yellow-400" />
                <h3 className="font-semibold mb-2">Verified Sellers</h3>
                <p className="text-sm text-slate-400">All sellers are verified and rated by our community</p>
              </div>
              <div>
                <Clock className="h-8 w-8 mx-auto mb-3 text-blue-400" />
                <h3 className="font-semibold mb-2">Real-Time Updates</h3>
                <p className="text-sm text-slate-400">Live auction updates and instant notifications</p>
              </div>
              <div>
                <Shield className="h-8 w-8 mx-auto mb-3 text-green-400" />
                <h3 className="font-semibold mb-2">Secure Transactions</h3>
                <p className="text-sm text-slate-400">Protected payments and guaranteed delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied buyers and sellers who trust TrustAuto for their car marketplace needs across Pakistan.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/register">Create Account</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/cars">Browse Cars</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-slate-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold">TrustAuto</span>
              </div>
              <p className="text-sm text-slate-600">
                Pakistan's most trusted car marketplace with 200-point inspections and AI-powered valuations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Marketplace</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link href="/cars">Browse Cars</Link></li>
                <li><Link href="/auctions">Live Auctions</Link></li>
                <li><Link href="/trade-in">Trade-In</Link></li>
                <li><Link href="/sell">Sell Your Car</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/inspection">Inspection Process</Link></li>
                <li><Link href="/trust">Why Trust Us</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
                <li><Link href="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-slate-600">
            <p>© 2025 TrustAuto Pakistan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
