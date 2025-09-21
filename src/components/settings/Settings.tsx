import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Bell, 
  Shield, 
  Database, 
  Palette, 
  Download,
  Upload,
  Trash2,
  Settings as SettingsIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const Settings: React.FC = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    role: userProfile?.role || 'cashier',
  });

  const [notifications, setNotifications] = useState({
    lowStock: true,
    dailyReports: true,
    newSales: false,
    systemUpdates: true,
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: '30',
  });

  const [system, setSystem] = useState({
    currency: 'USD',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    autoBackup: true,
  });

  const handleSaveProfile = () => {
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been saved successfully.',
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: 'Notifications Updated',
      description: 'Your notification preferences have been saved.',
    });
  };

  const handleExportData = () => {
    toast({
      title: 'Export Started',
      description: 'Your data export is being prepared...',
    });
  };

  const handleImportData = () => {
    toast({
      title: 'Import Ready',
      description: 'Select a file to import your data.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <SettingsIcon className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Settings</h2>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Current Role</Label>
              <div className="mt-1">
                <Badge variant="secondary" className="capitalize">
                  {profile.role}
                </Badge>
              </div>
            </div>
          </div>

          <Button onClick={handleSaveProfile}>
            Save Profile Changes
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Low Stock Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when products are running low
                </p>
              </div>
              <Switch
                checked={notifications.lowStock}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, lowStock: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Daily Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Receive daily sales and profit summaries
                </p>
              </div>
              <Switch
                checked={notifications.dailyReports}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, dailyReports: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>New Sales Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified for each new sale
                </p>
              </div>
              <Switch
                checked={notifications.newSales}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, newSales: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>System Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Important system and security updates
                </p>
              </div>
              <Switch
                checked={notifications.systemUpdates}
                onCheckedChange={(checked) => 
                  setNotifications({ ...notifications, systemUpdates: checked })
                }
              />
            </div>
          </div>

          <Button onClick={handleSaveNotifications}>
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch
                checked={security.twoFactorAuth}
                onCheckedChange={(checked) => 
                  setSecurity({ ...security, twoFactorAuth: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Login Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified of new login attempts
                </p>
              </div>
              <Switch
                checked={security.loginAlerts}
                onCheckedChange={(checked) => 
                  setSecurity({ ...security, loginAlerts: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Session Timeout (minutes)</Label>
              <Select
                value={security.sessionTimeout}
                onValueChange={(value) => setSecurity({ ...security, sessionTimeout: value })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button>Save Security Settings</Button>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={system.currency}
                onValueChange={(value) => setSystem({ ...system, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="JPY">JPY (¥)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select
                value={system.timezone}
                onValueChange={(value) => setSystem({ ...system, timezone: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="EST">EST</SelectItem>
                  <SelectItem value="PST">PST</SelectItem>
                  <SelectItem value="GMT">GMT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Automatic Backups</Label>
              <p className="text-sm text-muted-foreground">
                Automatically backup data daily
              </p>
            </div>
            <Switch
              checked={system.autoBackup}
              onCheckedChange={(checked) => 
                setSystem({ ...system, autoBackup: checked })
              }
            />
          </div>

          <Button>Save System Settings</Button>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            
            <Button variant="outline" onClick={handleImportData}>
              <Upload className="mr-2 h-4 w-4" />
              Import Data
            </Button>
            
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All Data
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Export your data for backup or transfer to another system. 
            Import feature allows you to restore from previous backups.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};