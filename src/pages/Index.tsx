import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthPage } from './AuthPage';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { ProductManagement } from '@/components/products/ProductManagement';
import { SalesManagement } from '@/components/sales/SalesManagement';
import { ExpenseManagement } from '@/components/expenses/ExpenseManagement';
import { PartnerManagement } from '@/components/partners/PartnerManagement';
import { EnhancedReportsAnalytics } from '@/components/reports/EnhancedReportsAnalytics';
import { Settings } from '@/components/settings/Settings';
import { OfflineIndicator } from '@/components/offline/OfflineIndicator';

const Index = () => {
  const { user, userProfile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return <AuthPage />;
  }

  const renderContent = () => {
    // Role-based access control
    const userRole = userProfile?.role || 'cashier';
    
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        if (!['admin', 'cashier'].includes(userRole)) {
          return <div className="text-center py-12 text-muted-foreground">Access denied</div>;
        }
        return <ProductManagement />;
      case 'sales':
        if (!['admin', 'cashier'].includes(userRole)) {
          return <div className="text-center py-12 text-muted-foreground">Access denied</div>;
        }
        return <SalesManagement />;
      case 'expenses':
        if (userRole !== 'admin') {
          return <div className="text-center py-12 text-muted-foreground">Access denied</div>;
        }
        return <ExpenseManagement />;
      case 'partners':
        if (userRole !== 'admin') {
          return <div className="text-center py-12 text-muted-foreground">Access denied</div>;
        }
        return <PartnerManagement />;
      case 'reports':
        if (!['admin', 'partner'].includes(userRole)) {
          return <div className="text-center py-12 text-muted-foreground">Access denied</div>;
        }
        return <EnhancedReportsAnalytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
      <OfflineIndicator />
    </DashboardLayout>
  );
};

export default Index;
