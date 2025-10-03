import React, { useEffect, useState } from 'react';
import { StatsCards } from './StatsCards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { DashboardStats } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, TrendingDown, Package, DollarSign } from 'lucide-react';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    todaySales: 0,
    monthlySales: 0,
    totalProfit: 0,
    totalTransactions: 0,
    lowStockItems: 0,
    topSellingProducts: [],
  });
  const [salesData, setSalesData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        // Fetch today's sales
        const { data: todaySales, error: todayError } = await supabase
          .from('sales')
          .select('total, profit')
          .gte('created_at', today.toISOString());
        
        if (todayError) throw todayError;

        // Fetch monthly sales
        const { data: monthlySales, error: monthlyError } = await supabase
          .from('sales')
          .select('total, profit, created_at')
          .gte('created_at', startOfMonth.toISOString());
        
        if (monthlyError) throw monthlyError;

        // Fetch low stock products
        const { data: lowStock, error: lowStockError } = await supabase
          .from('products')
          .select('id, stock, min_stock')
          .filter('stock', 'lte', 'min_stock');
        
        if (lowStockError) throw lowStockError;

        // Count low stock manually
        const lowStockCount = (lowStock || []).filter(p => p.stock <= p.min_stock).length;

        // Fetch top selling products from sale_items
        const { data: topProducts, error: topError } = await supabase
          .from('sale_items')
          .select('product_name, quantity, total, product_id')
          .order('quantity', { ascending: false })
          .limit(5);
        
        if (topError) throw topError;

        // Aggregate top products
        const productMap = new Map();
        topProducts?.forEach(item => {
          if (productMap.has(item.product_id)) {
            const existing = productMap.get(item.product_id);
            existing.totalSold += item.quantity;
            existing.revenue += item.total;
          } else {
            productMap.set(item.product_id, {
              productId: item.product_id,
              productName: item.product_name,
              totalSold: item.quantity,
              revenue: item.total,
            });
          }
        });

        // Get last 7 days sales for chart
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);
          const nextDay = new Date(date);
          nextDay.setDate(nextDay.getDate() + 1);
          
          const daySales = monthlySales?.filter(sale => {
            const saleDate = new Date(sale.created_at);
            return saleDate >= date && saleDate < nextDay;
          }) || [];
          
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          last7Days.push({
            name: dayName,
            sales: daySales.reduce((sum, sale) => sum + sale.total, 0),
            profit: daySales.reduce((sum, sale) => sum + sale.profit, 0),
          });
        }

        // Category distribution
        const { data: products } = await supabase
          .from('products')
          .select('name, stock');
        
        const categories = products?.slice(0, 5).map(p => ({
          name: p.name,
          value: p.stock,
        })) || [];

        setStats({
          todaySales: todaySales?.reduce((sum, sale) => sum + sale.total, 0) || 0,
          monthlySales: monthlySales?.reduce((sum, sale) => sum + sale.total, 0) || 0,
          totalProfit: monthlySales?.reduce((sum, sale) => sum + sale.profit, 0) || 0,
          totalTransactions: monthlySales?.length || 0,
          lowStockItems: lowStockCount,
          topSellingProducts: Array.from(productMap.values()).slice(0, 5),
        });
        
        setSalesData(last7Days);
        setCategoryData(categories);
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch dashboard data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <StatsCards stats={stats} />
      
      {/* Charts Grid */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Sales Overview (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="p-2 md:p-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Profit Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-2 md:p-6">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topSellingProducts.length > 0 ? (
                stats.topSellingProducts.map((product, index) => (
                  <div key={product.productId} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{product.productName}</p>
                        <p className="text-sm text-muted-foreground">{product.totalSold} units</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold">${product.revenue.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No sales data yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Stock Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-2 md:p-6">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-16">No inventory data</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};