'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, CreditCard, RefreshCw, Calendar, Users } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function PaymentAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [period, setPeriod] = useState('30');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/payments?period=${period}`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Failed to load analytics</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return `₨${(amount / 1000000).toFixed(2)}M`;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Payment Analytics</h1>
          <p className="text-gray-600">Comprehensive payment insights and trends</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('7')}
            className={`px-4 py-2 rounded ${period === '7' ? 'bg-black text-white' : 'bg-gray-200'}`}
          >
            7 Days
          </button>
          <button
            onClick={() => setPeriod('30')}
            className={`px-4 py-2 rounded ${period === '30' ? 'bg-black text-white' : 'bg-gray-200'}`}
          >
            30 Days
          </button>
          <button
            onClick={() => setPeriod('90')}
            className={`px-4 py-2 rounded ${period === '90' ? 'bg-black text-white' : 'bg-gray-200'}`}
          >
            90 Days
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.overview.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.overview.totalTransactions} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.overview.averageTransaction)}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.overview.totalRefunded)}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.overview.totalRefunds} refunds
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Installment Plans</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.installments.totalPlans}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(analytics.installments.totalFinanced)} financed
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trend" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trend">Revenue Trend</TabsTrigger>
          <TabsTrigger value="types">Payment Types</TabsTrigger>
          <TabsTrigger value="status">Status Distribution</TabsTrigger>
          <TabsTrigger value="cars">Top Cars</TabsTrigger>
        </TabsList>

        <TabsContent value="trend" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Daily revenue over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analytics.trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value: any) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
                  <Line type="monotone" dataKey="transactions" stroke="#82ca9d" name="Transactions" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Payment Type</CardTitle>
              <CardDescription>Breakdown of revenue by payment type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analytics.byType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value: any) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                  <Bar dataKey="count" fill="#82ca9d" name="Count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Status Distribution</CardTitle>
              <CardDescription>Distribution of payment statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={analytics.byStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.status}: ${entry.count}`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analytics.byStatus.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cars" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Cars</CardTitle>
              <CardDescription>Best performing vehicles by sales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topCars.map((car: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{car.name}</p>
                      <p className="text-sm text-gray-600">
                        {car.year} {car.make} {car.model}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatCurrency(car.totalRevenue)}</p>
                      <p className="text-sm text-gray-600">{car.salesCount} sales</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
