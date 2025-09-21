import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, TrendingUp, DollarSign, Calculator } from 'lucide-react';
import { Partner, PartnerTransaction } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const PartnerManagement: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      sharePercentage: 25,
      totalInvestment: 10000,
      totalWithdrawn: 2500,
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      sharePercentage: 30,
      totalInvestment: 15000,
      totalWithdrawn: 3000,
      createdAt: new Date(),
    },
  ]);

  const [transactions] = useState<PartnerTransaction[]>([
    {
      id: '1',
      partnerId: '1',
      type: 'investment',
      amount: 5000,
      description: 'Initial investment',
      createdAt: new Date(Date.now() - 86400000 * 30),
    },
    {
      id: '2',
      partnerId: '2',
      type: 'withdrawal',
      amount: 1500,
      description: 'Profit withdrawal',
      createdAt: new Date(Date.now() - 86400000 * 15),
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    sharePercentage: 0,
    initialInvestment: 0,
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || formData.sharePercentage <= 0) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const totalShares = partners.reduce((sum, p) => sum + p.sharePercentage, 0) + formData.sharePercentage;
    
    if (totalShares > 100) {
      toast({
        title: 'Share Percentage Exceeded',
        description: `Total shares would be ${totalShares}%. Maximum allowed is 100%.`,
        variant: 'destructive',
      });
      return;
    }

    const newPartner: Partner = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      sharePercentage: formData.sharePercentage,
      totalInvestment: formData.initialInvestment,
      totalWithdrawn: 0,
      createdAt: new Date(),
    };

    setPartners([...partners, newPartner]);
    setFormData({ name: '', email: '', sharePercentage: 0, initialInvestment: 0 });
    setShowForm(false);
    
    toast({
      title: 'Partner Added',
      description: `${formData.name} has been added as a partner with ${formData.sharePercentage}% share`,
    });
  };

  const totalShares = partners.reduce((sum, p) => sum + p.sharePercentage, 0);
  const totalInvestments = partners.reduce((sum, p) => sum + p.totalInvestment, 0);
  const totalWithdrawals = partners.reduce((sum, p) => sum + p.totalWithdrawn, 0);

  // Mock monthly profit for calculation
  const monthlyProfit = 8500;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Partner Management</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Partner
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-muted-foreground" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Partners</p>
                <p className="text-2xl font-bold">{partners.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calculator className="h-8 w-8 text-muted-foreground" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Shares</p>
                <p className="text-2xl font-bold">{totalShares}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Investments</p>
                <p className="text-2xl font-bold">${totalInvestments.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-muted-foreground" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Withdrawals</p>
                <p className="text-2xl font-bold">${totalWithdrawals.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Partner Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Partner</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Partner Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter partner name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="partner@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sharePercentage">Share Percentage (%)</Label>
                  <Input
                    id="sharePercentage"
                    type="number"
                    min="1"
                    max={100 - totalShares}
                    value={formData.sharePercentage}
                    onChange={(e) => setFormData({ ...formData, sharePercentage: Number(e.target.value) })}
                    placeholder="25"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Available: {100 - totalShares}%
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="initialInvestment">Initial Investment ($)</Label>
                  <Input
                    id="initialInvestment"
                    type="number"
                    step="0.01"
                    value={formData.initialInvestment}
                    onChange={(e) => setFormData({ ...formData, initialInvestment: Number(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Add Partner</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Partners List */}
      <Card>
        <CardHeader>
          <CardTitle>Partner Details & Profit Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {partners.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No partners added yet. Add your first partner above.
            </p>
          ) : (
            <div className="space-y-4">
              {partners.map((partner) => {
                const monthlyShare = (monthlyProfit * partner.sharePercentage) / 100;
                const netBalance = partner.totalInvestment - partner.totalWithdrawn + monthlyShare;
                
                return (
                  <div
                    key={partner.id}
                    className="p-6 bg-muted rounded-lg space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{partner.name}</h3>
                        <p className="text-muted-foreground">{partner.email}</p>
                        <Badge variant="outline" className="mt-2">
                          {partner.sharePercentage}% Share
                        </Badge>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-sm text-muted-foreground">Net Balance</p>
                        <p className="text-xl font-bold text-green-600">
                          ${netBalance.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Investment</p>
                        <p className="font-medium">${partner.totalInvestment.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Withdrawn</p>
                        <p className="font-medium text-red-600">${partner.totalWithdrawn.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Monthly Share</p>
                        <p className="font-medium text-green-600">${monthlyShare.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Partner Since</p>
                        <p className="font-medium">{partner.createdAt.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};