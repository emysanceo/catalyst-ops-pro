import { Product, Sale, SaleItem } from '@/types';

// Demo products
export const demoProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Coffee Beans',
    category: 'Coffee',
    costPrice: 12.50,
    sellPrice: 18.99,
    stock: 45,
    minStock: 10,
    description: 'High-quality arabica coffee beans from Colombia',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Wireless Headphones',
    category: 'Electronics',
    costPrice: 75.00,
    sellPrice: 129.99,
    stock: 23,
    minStock: 5,
    description: 'Bluetooth wireless headphones with noise cancellation',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '3',
    name: 'Organic Green Tea',
    category: 'Tea',
    costPrice: 8.00,
    sellPrice: 14.99,
    stock: 67,
    minStock: 15,
    description: 'Premium organic green tea leaves',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: '4',
    name: 'Smartphone Case',
    category: 'Electronics',
    costPrice: 5.50,
    sellPrice: 12.99,
    stock: 120,
    minStock: 20,
    description: 'Protective case for smartphones',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: '5',
    name: 'Artisan Chocolate',
    category: 'Food',
    costPrice: 6.75,
    sellPrice: 11.99,
    stock: 8,
    minStock: 10,
    description: 'Handcrafted dark chocolate bar',
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19'),
  },
];

// Demo sales
export const demoSales: Sale[] = [
  {
    id: 'sale-1',
    items: [
      {
        productId: '1',
        productName: 'Premium Coffee Beans',
        quantity: 2,
        unitPrice: 18.99,
        costPrice: 12.50,
        total: 37.98,
      },
      {
        productId: '3',
        productName: 'Organic Green Tea',
        quantity: 1,
        unitPrice: 14.99,
        costPrice: 8.00,
        total: 14.99,
      },
    ],
    total: 52.97,
    discount: 0,
    tax: 4.24,
    paymentMethod: 'card',
    cashierId: 'cashier-demo-456',
    createdAt: new Date('2024-01-20T10:30:00'),
    profit: 25.47,
  },
  {
    id: 'sale-2',
    items: [
      {
        productId: '2',
        productName: 'Wireless Headphones',
        quantity: 1,
        unitPrice: 129.99,
        costPrice: 75.00,
        total: 129.99,
      },
    ],
    total: 129.99,
    discount: 5.00,
    tax: 10.40,
    paymentMethod: 'cash',
    cashierId: 'admin-demo-123',
    createdAt: new Date('2024-01-20T14:15:00'),
    profit: 49.99,
  },
  {
    id: 'sale-3',
    items: [
      {
        productId: '4',
        productName: 'Smartphone Case',
        quantity: 3,
        unitPrice: 12.99,
        costPrice: 5.50,
        total: 38.97,
      },
      {
        productId: '5',
        productName: 'Artisan Chocolate',
        quantity: 2,
        unitPrice: 11.99,
        costPrice: 6.75,
        total: 23.98,
      },
    ],
    total: 62.95,
    discount: 2.00,
    tax: 4.88,
    paymentMethod: 'mobile',
    cashierId: 'cashier-demo-456',
    createdAt: new Date('2024-01-21T09:45:00'),
    profit: 33.47,
  },
];

// Local storage keys
export const STORAGE_KEYS = {
  PRODUCTS: 'demo-products',
  SALES: 'demo-sales',
  EXPENSES: 'demo-expenses',
  PARTNERS: 'demo-partners',
};

// Initialize demo data in localStorage
export const initializeDemoData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(demoProducts));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SALES)) {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(demoSales));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EXPENSES)) {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PARTNERS)) {
    localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify([]));
  }
};

// Helper functions for demo data management
export const getDemoProducts = (): Product[] => {
  const products = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return products ? JSON.parse(products) : demoProducts;
};

export const saveDemoProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

export const getDemoSales = (): Sale[] => {
  const sales = localStorage.getItem(STORAGE_KEYS.SALES);
  return sales ? JSON.parse(sales).map((sale: any) => ({
    ...sale,
    createdAt: new Date(sale.createdAt),
  })) : demoSales;
};

export const saveDemoSales = (sales: Sale[]) => {
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
};