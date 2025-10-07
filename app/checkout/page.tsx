"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CreditCard, Lock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

function CheckoutForm({ amount, carName }: { amount: number; carName: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || "Payment failed");
        setLoading(false);
        return;
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: "if_required",
      });

      if (confirmError) {
        setError(confirmError.message || "Payment failed");
        setLoading(false);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setSuccess(true);
        setTimeout(() => {
          router.push("/checkout/success?payment_intent=" + paymentIntent.id);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₨${(amount / 1000000).toFixed(2)}M`;
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
        <p className="text-slate-600">Redirecting to confirmation page...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">Secure Payment</span>
        </div>
        <p className="text-sm text-blue-700">
          Your payment information is encrypted and secure. We never store your card details.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Payment Details</label>
        <div className="p-4 border rounded-lg bg-white">
          <PaymentElement />
        </div>
      </div>

      <div className="p-4 bg-slate-50 rounded-lg space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Vehicle:</span>
          <span className="font-medium">{carName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Payment Type:</span>
          <span className="font-medium">Full Purchase</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between">
            <span className="font-semibold">Total Amount:</span>
            <span className="text-2xl font-bold text-blue-600">{formatCurrency(amount)}</span>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={!stripe || loading}
      >
        {loading ? (
          "Processing..."
        ) : (
          <>
            <CreditCard className="h-5 w-5 mr-2" />
            Pay {formatCurrency(amount)}
          </>
        )}
      </Button>

      <p className="text-xs text-center text-slate-500">
        By completing this purchase, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  );
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const carId = searchParams.get("carId");
  const amount = searchParams.get("amount");
  const carName = searchParams.get("carName");
  const type = searchParams.get("type") || "purchase";

  useEffect(() => {
    if (!carId || !amount) {
      setError("Missing required parameters");
      setLoading(false);
      return;
    }

    // Get user from localStorage
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userStr);

    // Create payment intent
    fetch("/api/payments/create-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: parseFloat(amount),
        carId: parseInt(carId),
        userId: user.id,
        type,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setLoading(false);
        } else {
          setClientSecret(data.clientSecret);
          setLoading(false);
        }
      })
      .catch((err) => {
        setError("Failed to initialize payment");
        setLoading(false);
      });
  }, [carId, amount, type, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Initializing secure payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Payment Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/cars">Back to Browse Cars</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">TrustAuto</span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Lock className="h-4 w-4" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-blue-600" />
              Complete Your Purchase
            </CardTitle>
            <CardDescription>
              Enter your payment details to complete the purchase of {carName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {clientSecret && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "stripe",
                    variables: {
                      colorPrimary: "#2563eb",
                    },
                  },
                }}
              >
                <CheckoutForm
                  amount={parseFloat(amount || "0")}
                  carName={carName || "Vehicle"}
                />
              </Elements>
            )}
          </CardContent>
        </Card>

        {/* Security Features */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="text-center p-4">
            <Lock className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium">256-bit SSL Encryption</p>
          </div>
          <div className="text-center p-4">
            <Shield className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium">PCI DSS Compliant</p>
          </div>
          <div className="text-center p-4">
            <CheckCircle2 className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium">Buyer Protection</p>
          </div>
        </div>
      </div>
    </div>
  );
}
