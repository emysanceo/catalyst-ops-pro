import React from 'react';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Users, 
  BarChart3, 
  Settings 
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: 'admin' | 'cashier' | 'partner';
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'cashier', 'partner'] },
  { id: 'products', label: 'Products', icon: Package, roles: ['admin', 'cashier'] },
  { id: 'sales', label: 'Sales', icon: ShoppingCart, roles: ['admin', 'cashier'] },
  { id: 'expenses', label: 'Expenses', icon: DollarSign, roles: ['admin'] },
  { id: 'partners', label: 'Partners', icon: Users, roles: ['admin'] },
  { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['admin', 'partner'] },
  { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin', 'cashier', 'partner'] },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ 
  activeTab, 
  onTabChange, 
  userRole 
}) => {
  const accessibleItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 md:hidden">
      <div className="grid grid-cols-4 gap-1 p-2">
        {accessibleItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg text-xs transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="truncate w-full">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};