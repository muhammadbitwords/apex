"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Car, DollarSign, Gauge, Calendar, Palette, Tag, FileText, CheckCircle2, Shield } from "lucide-react";
import Link from "next/link";
import { useSocket } from "@/lib/socket-context";
import { toast } from "sonner";

const formSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().min(1900, "Invalid year").max(new Date().getFullYear(), "Year cannot be in the future"),
  mileage: z.number().min(0, "Mileage cannot be negative"),
  price: z.number().min(0, "Price cannot be negative"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description cannot exceed 500 characters"),
  condition: z.enum(["new", "used", "certified-used"], { message: "Please select a valid condition" }),
  transmission: z.enum(["automatic", "manual"], { message: "Please select a valid transmission type" }),
  fuel_type: z.enum(["petrol", "diesel", "electric", "hybrid"], { message: "Please select a valid fuel type" }),
  color: z.string().min(1, "Color is required"),
  vin: z.string().length(17, "VIN must be 17 characters long").optional().or(z.literal("")),
  // Placeholder for images - in a real app, this would handle file uploads
  images: z.array(z.string()).optional(),
});

type ListingFormValues = z.infer<typeof formSchema>;

export default function AddNewListingPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSocket();
  const [loading, setLoading] = useState(true);

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      mileage: 0,
      price: 0,
      description: "",
      condition: "used",
      transmission: "automatic",
      fuel_type: "petrol",
      color: "",
      vin: "",
      images: [],
    },
  });

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push("/login");
      toast.error("You must be logged in to add a new listing.");
    } else if (user && user.role !== "seller" && user.role !== "dealer") {
      router.push("/dashboard");
      toast.error("Only sellers and dealers can add new listings.");
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, loading, router, user]);

  const onSubmit = async (values: ListingFormValues) => {
    setLoading(true);
    try {
      const response = await fetch("/api/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`, // Send JWT token
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to add listing.");
        return;
      }

      toast.success("Listing added successfully!");
      router.push("/dashboard"); // Redirect to dashboard after successful listing
    } catch (error) {
      console.error("Error adding listing:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
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
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">TrustAuto</span>
          </Link>
          <Button variant="outline" onClick={() => router.back()}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Add New Car Listing</h1>
            <p className="text-slate-600">Provide details about the car you want to sell.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Car Details</CardTitle>
              <CardDescription>Fill in the information below to create your listing.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Make */}
                  <div className="space-y-2">
                    <Label htmlFor="make">Make *</Label>
                    <Input id="make" placeholder="Toyota" {...form.register("make")} />
                    {form.formState.errors.make && (
                      <p className="text-red-500 text-sm">{form.formState.errors.make.message}</p>
                    )}
                  </div>

                  {/* Model */}
                  <div className="space-y-2">
                    <Label htmlFor="model">Model *</Label>
                    <Input id="model" placeholder="Corolla" {...form.register("model")} />
                    {form.formState.errors.model && (
                      <p className="text-red-500 text-sm">{form.formState.errors.model.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Year */}
                  <div className="space-y-2">
                    <Label htmlFor="year">Year *</Label>
                    <Input id="year" type="number" placeholder="2020" {...form.register("year", { valueAsNumber: true })} />
                    {form.formState.errors.year && (
                      <p className="text-red-500 text-sm">{form.formState.errors.year.message}</p>
                    )}
                  </div>

                  {/* Mileage */}
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Mileage (km) *</Label>
                    <Input id="mileage" type="number" placeholder="50000" {...form.register("mileage", { valueAsNumber: true })} />
                    {form.formState.errors.mileage && (
                      <p className="text-red-500 text-sm">{form.formState.errors.mileage.message}</p>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Price (PKR) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input id="price" type="number" placeholder="2500000" className="pl-10" {...form.register("price", { valueAsNumber: true })} />
                  </div>
                  {form.formState.errors.price && (
                    <p className="text-red-500 text-sm">{form.formState.errors.price.message}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea id="description" placeholder="Describe your car in detail..." rows={5} {...form.register("description")} />
                  {form.formState.errors.description && (
                    <p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Condition */}
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition *</Label>
                    <Select onValueChange={(value) => form.setValue("condition", value as "new" | "used" | "certified-used")} defaultValue={form.watch("condition")}>
                      <SelectTrigger id="condition">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="used">Used</SelectItem>
                        <SelectItem value="certified-used">Certified Used</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.condition && (
                      <p className="text-red-500 text-sm">{form.formState.errors.condition.message}</p>
                    )}
                  </div>

                  {/* Transmission */}
                  <div className="space-y-2">
                    <Label htmlFor="transmission">Transmission *</Label>
                    <Select onValueChange={(value) => form.setValue("transmission", value as "automatic" | "manual")} defaultValue={form.watch("transmission")}>
                      <SelectTrigger id="transmission">
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="automatic">Automatic</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.transmission && (
                      <p className="text-red-500 text-sm">{form.formState.errors.transmission.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Fuel Type */}
                  <div className="space-y-2">
                    <Label htmlFor="fuel_type">Fuel Type *</Label>
                    <Select onValueChange={(value) => form.setValue("fuel_type", value as "petrol" | "diesel" | "electric" | "hybrid")} defaultValue={form.watch("fuel_type")}>
                      <SelectTrigger id="fuel_type">
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.fuel_type && (
                      <p className="text-red-500 text-sm">{form.formState.errors.fuel_type.message}</p>
                    )}
                  </div>

                  {/* Color */}
                  <div className="space-y-2">
                    <Label htmlFor="color">Color *</Label>
                    <Input id="color" placeholder="White" {...form.register("color")} />
                    {form.formState.errors.color && (
                      <p className="text-red-500 text-sm">{form.formState.errors.color.message}</p>
                    )}
                  </div>
                </div>

                {/* VIN */}
                <div className="space-y-2">
                  <Label htmlFor="vin">VIN (Vehicle Identification Number)</Label>
                  <Input id="vin" placeholder="17-character VIN" {...form.register("vin")} />
                  {form.formState.errors.vin && (
                    <p className="text-red-500 text-sm">{form.formState.errors.vin.message}</p>
                  )}
                </div>

                {/* Image Upload Placeholder */}
                <div className="space-y-2">
                  <Label htmlFor="images">Car Images</Label>
                  <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg text-slate-500">
                    <Plus className="h-6 w-6 mr-2" />
                    <span>Upload Images (Placeholder)</span>
                  </div>
                  <p className="text-sm text-slate-500">
                    In a real application, this would be a robust image upload component.
                  </p>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting || loading}>
                  {form.formState.isSubmitting ? "Adding Listing..." : "Add Listing"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}