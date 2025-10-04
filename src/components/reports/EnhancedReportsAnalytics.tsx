import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, TrendingUp, Package, DollarSign, BarChart3 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatBDT, formatBDDate, getDateRanges } from '@/lib/formatters';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays, subMonths, format } from 'date-fns';

type PeriodType = 'today' | 'week' | 'month' | 'year' | 'custom';

interface SalesData {
  date: string;
  sales: number;
  profit: number;
  transactions: number;
}

interface TopProduct {
  id: string;
  name: string;
  totalSold: number;
  revenue: number;
  profit: number;
}

interface CategoryData {
  name: string;
  value: number;
  percentage: number;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', '#8884d8', '#82ca9d'];

export const EnhancedReportsAnalytics: React.FC = () => {
  const [period, setPeriod] = useState<PeriodType>('month');
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalProfit: 0,
    totalTransactions: 0,
    avgOrderValue: 0,
    growthRate: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalyticsData();
  }, [period]);

  const getDateRange = () => {
    const now = new Date();
    let startDate: Date;
    let endDate = endOfDay(now);

    switch (period) {
      case 'today':
        startDate = startOfDay(now);
        break;
      case 'week':
        startDate = startOfWeek(now);
        break;
      case 'month':
        startDate = startOfMonth(now);
        break;
      case 'year':
        startDate = startOfYear(now);
        break;
      default:
        startDate = startOfMonth(now);
    }

    return { startDate, endDate };
  };

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const { startDate, endDate } = getDateRange();

      // Fetch sales data
      const { data: salesRecords, error: salesError } = await supabase
        .from('sales')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at');

      if (salesError) throw salesError;

      // Fetch sale items with product info
      const { data: saleItems, error: itemsError } = await supabase
        .from('sale_items')
        .select(`
          *,
          sale:sales!inner(created_at)
        `)
        .gte('sale.created_at', startDate.toISOString())
        .lte('sale.created_at', endDate.toISOString());

      if (itemsError) throw itemsError;

      // Process sales data by date
      const salesByDate = processSalesByDate(salesRecords || [], period);
      setSalesData(salesByDate);

      // Calculate stats
      const totalSales = (salesRecords || []).reduce((sum, sale) => sum + Number(sale.total), 0);
      const totalProfit = (salesRecords || []).reduce((sum, sale) => sum + Number(sale.profit), 0);
      const totalTransactions = (salesRecords || []).length;
      const avgOrderValue = totalTransactions > 0 ? totalSales / totalTransactions : 0;

      // Calculate growth rate (comparing to previous period)
      const prevPeriodStart = getPreviousPeriodStart(startDate);
      const { data: prevSales } = await supabase
        .from('sales')
        .select('total')
        .gte('created_at', prevPeriodStart.toISOString())
        .lt('created_at', startDate.toISOString());

      const prevTotal = (prevSales || []).reduce((sum, sale) => sum + Number(sale.total), 0);
      const growthRate = prevTotal > 0 ? ((totalSales - prevTotal) / prevTotal) * 100 : 0;

      setStats({
        totalSales,
        totalProfit,
        totalTransactions,
        avgOrderValue,
        growthRate,
      });

      // Process top products
      const productSales = new Map<string, { name: string; totalSold: number; revenue: number; profit: number }>();
      
      (saleItems || []).forEach((item: any) => {
        const existing = productSales.get(item.product_id) || {
          name: item.product_name,
          totalSold: 0,
          revenue: 0,
          profit: 0,
        };
        
        existing.totalSold += item.quantity;
        existing.revenue += Number(item.total);
        existing.profit += Number(item.profit);
        
        productSales.set(item.product_id, existing);
      });

      const topProductsList = Array.from(productSales.entries())
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      setTopProducts(topProductsList);

      // Fetch category data
      const { data: categories } = await supabase.from('categories').select('id, name');
      const { data: products } = await supabase.from('products').select('id, category_id');

      if (categories && products) {
        const categoryMap = new Map(categories.map(c => [c.id, c.name]));
        const categorySales = new Map<string, number>();

        (saleItems || []).forEach((item: any) => {
          const product = products.find(p => p.id === item.product_id);
          if (product?.category_id) {
            const catName = categoryMap.get(product.category_id) || 'Uncategorized';
            categorySales.set(catName, (categorySales.get(catName) || 0) + Number(item.total));
          }
        });

        const totalCategorySales = Array.from(categorySales.values()).reduce((sum, val) => sum + val, 0);
        const categoryDataList = Array.from(categorySales.entries())
          .map(([name, value]) => ({
            name,
            value,
            percentage: totalCategorySales > 0 ? (value / totalCategorySales) * 100 : 0,
          }))
          .sort((a, b) => b.value - a.value);

        setCategoryData(categoryDataList);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to load analytics data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const processSalesByDate = (sales: any[], periodType: PeriodType): SalesData[] => {
    const dataMap = new Map<string, { sales: number; profit: number; transactions: number }>();

    sales.forEach((sale) => {
      let dateKey: string;
      const saleDate = new Date(sale.created_at);

      switch (periodType) {
        case 'today':
        case 'week':
          dateKey = format(saleDate, 'EEE'); // Day of week
          break;
        case 'month':
          dateKey = format(saleDate, 'dd MMM'); // Day of month
          break;
        case 'year':
          dateKey = format(saleDate, 'MMM'); // Month
          break;
        default:
          dateKey = format(saleDate, 'dd MMM');
      }

      const existing = dataMap.get(dateKey) || { sales: 0, profit: 0, transactions: 0 };
      existing.sales += Number(sale.total);
      existing.profit += Number(sale.profit);
      existing.transactions += 1;
      dataMap.set(dateKey, existing);
    });

    return Array.from(dataMap.entries()).map(([date, data]) => ({
      date,
      ...data,
    }));
  };

  const getPreviousPeriodStart = (currentStart: Date): Date => {
    switch (period) {
      case 'today':
        return subDays(currentStart, 1);
      case 'week':
        return subDays(currentStart, 7);
      case 'month':
        return subMonths(currentStart, 1);
      case 'year':
        return subMonths(currentStart, 12);
      default:
        return subMonths(currentStart, 1);
    }
  };

  const handleExport = (format: 'csv' | 'excel') => {
    toast({
      title: 'Export Started',
      description: `Exporting report as ${format.toUpperCase()}...`,
    });
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Analytics & Reports</h2>
          <p className="text-muted-foreground">Comprehensive sales analytics and insights</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={period} onValueChange={(value) => setPeriod(value as PeriodType)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBDT(stats.totalSales)}</div>
            <p className="text-xs text-muted-foreground">
              <span className={stats.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}>
                {stats.growthRate >= 0 ? '+' : ''}{stats.growthRate.toFixed(1)}%
              </span>
              {' '}from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBDT(stats.totalProfit)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalSales > 0 ? ((stats.totalProfit / stats.totalSales) * 100).toFixed(1) : 0}% margin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">Total orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBDT(stats.avgOrderValue)}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales & Profit Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `৳${value}`} />
                  <Tooltip 
                    formatter={(value: any) => formatBDT(Number(value))}
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Legend />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" name="Sales" />
                  <Bar dataKey="profit" fill="hsl(var(--secondary))" name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="transactions" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Transactions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} (${percentage.toFixed(1)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => formatBDT(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-3">
                  {categoryData.map((cat, index) => (
                    <div key={cat.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{cat.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatBDT(cat.value)}</div>
                        <div className="text-xs text-muted-foreground">{cat.percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {product.totalSold} units sold
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatBDT(product.revenue)}</div>
                      <div className="text-sm text-green-600">+{formatBDT(product.profit)} profit</div>
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
};
