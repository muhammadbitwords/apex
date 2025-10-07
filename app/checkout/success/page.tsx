"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle2, Download, Home, Car } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [error, setError] = useState("");

  const paymentIntentId = searchParams.get("payment_intent");

  useEffect(() => {
    if (!paymentIntentId) {
      setError("No payment information found");
      setLoading(false);
      return;
    }

    // Verify payment
    fetch("/api/payments/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentIntentId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setPaymentDetails(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to verify payment");
        setLoading(false);
      });
  }, [paymentIntentId]);

  const formatCurrency = (amount: number) => {
    return `₨${(amount / 1000000).toFixed(2)}M`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Payment Verification Failed</CardTitle>
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
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Success Card */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-green-100 rounded-full">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-3xl text-green-600">Payment Successful!</CardTitle>
            <CardDescription className="text-lg">
              Your payment has been processed successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment Details */}
            <div className="p-4 bg-slate-50 rounded-lg space-y-3">
              <h3 className="font-semibold text-lg mb-3">Payment Details</h3>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Transaction ID:</span>
                <span className="font-mono text-xs">{paymentIntentId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Amount Paid:</span>
                <span className="font-semibold">
                  {paymentDetails?.transaction && formatCurrency(paymentDetails.transaction.amount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Payment Type:</span>
                <span className="font-semibold capitalize">
                  {paymentDetails?.transaction?.type?.replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Status:</span>
                <span className="font-semibold text-green-600">Completed</span>
              </div>
            </div>

            {/* Next Steps */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>You will receive a confirmation email shortly</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Our team will contact you within 24 hours to arrange delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>You can track your order in your dashboard</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-2 gap-4">
              <Button asChild variant="outline" size="lg">
                <Link href="/dashboard">
                  <Home className="h-5 w-5 mr-2" />
                  Go to Dashboard
                </Link>
              </Button>
              <Button asChild size="lg">
                <Link href="/cars">
                  <Car className="h-5 w-5 mr-2" />
                  Browse More Cars
                </Link>
              </Button>
            </div>

            <Button variant="outline" className="w-full" size="lg">
              <Download className="h-5 w-5 mr-2" />
              Download Receipt
            </Button>
          </CardContent>
        </Card>

        {/* Support Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              If you have any questions about your purchase, our support team is here to help.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <Link href="/support">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/faq">View FAQ</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
