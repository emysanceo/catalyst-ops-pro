// Remove duplicate interfaces and fix types
export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'cashier' | 'partner';
  name: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  category_id?: string;
  subcategory_id?: string;
  cost_price: number;
  sell_price: number;
  stock: number;
  min_stock: number;
  barcode?: string;
  image_url?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
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
  date: Date;
  createdBy: string;
  createdAt: Date;
}

export interface Partner {
  id: string;
  name: string;
  email: string;
  sharePercentage: number;
  totalInvestment: number;
  totalWithdrawn: number;
  createdAt: Date;
}

export interface PartnerTransaction {
  id: string;
  partnerId: string;
  type: 'investment' | 'withdrawal' | 'profit_share';
  amount: number;
  description: string;
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