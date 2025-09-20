export interface Product {
  id: string;
  name: string;
  category: string;
  costPrice: number;
  sellPrice: number;
  stock: number;
  minStock: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  discount: number;
  tax: number;
  paymentMethod: 'cash' | 'card' | 'mobile';
  cashierId: string;
  createdAt: Date;
  profit: number;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  total: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: 'expense' | 'investment' | 'withdrawal';
  createdAt: Date;
  createdBy: string;
}

export interface Partner {
  id: string;
  name: string;
  email: string;
  sharePercentage: number;
  totalInvestment: number;
  totalWithdrawal: number;
  currentBalance: number;
  createdAt: Date;
}

export interface DashboardStats {
  todaySales: number;
  monthlySales: number;
  totalProfit: number;
  totalTransactions: number;
  lowStockItems: number;
  topSellingProducts: Array<{
    productId: string;
    productName: string;
    totalSold: number;
    revenue: number;
  }>;
}