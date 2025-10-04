import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, TrendingUp, Package } from 'lucide-react';
import { DashboardStats } from '@/types';
import { formatBDT } from '@/lib/formatters';

interface StatsCardsProps {
  stats: DashboardStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: "Today's Sales",
      value: formatBDT(stats.todaySales),
      icon: DollarSign,
      change: "+12.5%",
      changeType: "positive" as const,
    },
    {
      title: "Monthly Sales",
      value: formatBDT(stats.monthlySales),
      icon: TrendingUp,
      change: "+8.2%",
      changeType: "positive" as const,
    },
    {
      title: "Total Profit",
      value: formatBDT(stats.totalProfit),
      icon: DollarSign,
      change: "+15.3%",
      changeType: "positive" as const,
    },
    {
      title: "Total Transactions",
      value: stats.totalTransactions.toString(),
      icon: ShoppingCart,
      change: "+7.4%",
      changeType: "positive" as const,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className={card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                {card.change}
              </span>
              {' '}from last month
            </p>
          </CardContent>
        </Card>
      ))}
      
      {stats.lowStockItems > 0 && (
        <Card className="border-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
            <Package className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">items need restocking</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};