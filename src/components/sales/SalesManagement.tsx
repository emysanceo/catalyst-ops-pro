import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Sale } from '@/types';
import { SalesForm } from './SalesForm';
import { SalesHistory } from './SalesHistory';

export const SalesManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);

  const handleSaleComplete = (sale: Sale) => {
    setSales([sale, ...sales]);
    setShowForm(false);
  };

  if (showForm) {
    return (
      <SalesForm
        onComplete={handleSaleComplete}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sales Management</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Sale
        </Button>
      </div>

      <SalesHistory sales={sales} />
    </div>
  );
};