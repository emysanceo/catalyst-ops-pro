import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, Calendar, TrendingUp, DollarSign, Package, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const salesData = [
  { month: 'Jan', sales: 45230, profit: 12340, transactions: 156 },
  { month: 'Feb', sales: 52100, profit: 14200, transactions: 178 },
  { month: 'Mar', sales: 48750, profit: 13150, transactions: 167 },
  { month: 'Apr', sales: 56800, profit: 15900, transactions: 189 },
  { month: 'May', sales: 62340, profit: 17200, transactions: 203 },
  { month: 'Jun', sales: 58920, profit: 16100, transactions: 195 },
];

const categoryData = [
  { name: 'Beverages', value: 35, color: '#8884d8' },
  { name: 'Electronics', value: 28, color: '#82ca9d' },
  { name: 'Clothing', value: 20, color: '#ffc658' },
  { name: 'Books', value: 12, color: '#ff7c7c' },
  { name: 'Others', value: 5, color: '#8dd1e1' },
];

const topProducts = [
  { name: 'Premium Coffee Beans', sales: 450, revenue: 11250, profit: 4500 },
  { name: 'Wireless Headphones', sales: 320, revenue: 32000, profit: 9600 },
  { name: 'Organic Tea Bags', sales: 280, revenue: 4200, profit: 1960 },
  { name: 'Smart Watch', sales: 150, revenue: 37500, profit: 11250 },
  { name: 'Notebook Set', sales: 200, revenue: 3000, profit: 1000 },
];

export const ReportsAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedReport, setSelectedReport] = useState('overview');
  const { toast } = useToast();

  const handleExport = (format: 'csv' | 'excel') => {
    toast({
      title: 'Export Started',
      description: `Your ${format.toUpperCase()} report is being generated...`,
    });
    
    // Mock export functionality
    setTimeout(() => {
      toast({
        title: 'Export Complete',
        description: `Report has been downloaded as ${format.toUpperCase()}`,
      });
    }, 2000);
  };

  const totalSales = salesData.reduce((sum, data) => sum + data.sales, 0);
  const totalProfit = salesData.reduce((sum, data) => sum + data.profit, 0);
  const totalTransactions = salesData.reduce((sum, data) => sum + data.transactions, 0);
  const avgOrderValue = totalSales / totalTransactions;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <Download className="mr-2 h-4 w-4" />
            Excel
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-muted-foreground" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold">${totalSales.toLocaleString()}</p>
                <p className="text-xs text-green-600">+12% from last period</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Profit</p>
                <p className="text-2xl font-bold">${totalProfit.toLocaleString()}</p>
                <p className="text-xs text-green-600">+18% from last period</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold">{totalTransactions}</p>
                <p className="text-xs text-green-600">+8% from last period</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calculator className="h-8 w-8 text-muted-foreground" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</p>
                <p className="text-xs text-green-600">+5% from last period</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales & Profit Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="hsl(var(--primary))" name="Sales" />
                <Bar dataKey="profit" fill="hsl(var(--accent))" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Volume Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="transactions" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">${product.revenue.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+${product.profit.toLocaleString()} profit</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Calculator = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <line x1="8" x2="16" y1="6" y2="6" />
    <line x1="8" x2="16" y1="10" y2="10" />
    <line x1="8" x2="16" y1="14" y2="14" />
    <line x1="8" x2="16" y1="18" y2="18" />
  </svg>
);