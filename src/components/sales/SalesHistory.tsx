import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Receipt, Eye } from 'lucide-react';
import { Sale } from '@/types';
import { format } from 'date-fns';

interface SalesHistoryProps {
  sales: Sale[];
}

export const SalesHistory: React.FC<SalesHistoryProps> = ({ sales }) => {
  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash':
        return 'bg-green-100 text-green-800';
      case 'card':
        return 'bg-blue-100 text-blue-800';
      case 'mobile':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const generateReceipt = (sale: Sale) => {
    // In a real app, this would generate a PDF receipt
    console.log('Generating receipt for sale:', sale.id);
  };

  if (sales.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">No sales recorded yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recent Sales</h3>
      
      <div className="grid gap-4">
        {sales.map((sale) => (
          <Card key={sale.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">Sale #{sale.id}</span>
                    <Badge className={getPaymentMethodColor(sale.paymentMethod)}>
                      {sale.paymentMethod.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {format(sale.createdAt, 'MMM dd, yyyy - hh:mm a')}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Items: </span>
                      <span className="font-medium">{sale.items.length}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total: </span>
                      <span className="font-medium">${sale.total.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Profit: </span>
                      <span className="font-medium text-green-600">${sale.profit.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Discount: </span>
                      <span className="font-medium">${sale.discount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => generateReceipt(sale)}
                  >
                    <Receipt className="mr-1 h-3 w-3" />
                    Receipt
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    Details
                  </Button>
                </div>
              </div>
              
              {/* Sale Items */}
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium">Items:</h4>
                <div className="space-y-1">
                  {sale.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.productName} x{item.quantity}
                      </span>
                      <span>${item.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};