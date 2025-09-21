import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, User, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const demoCredentials = [
  {
    role: 'Admin',
    email: 'admin@demo.com',
    password: 'admin123',
    icon: User,
  },
  {
    role: 'Cashier',
    email: 'cashier@demo.com',
    password: 'cashier123',
    icon: Key,
  },
  {
    role: 'Partner',
    email: 'partner@demo.com',
    password: 'partner123',
    icon: User,
  },
];

export const DemoCredentials: React.FC = () => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${type} copied to clipboard`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Demo Login Credentials</h3>
        <p className="text-sm text-muted-foreground">
          Use these credentials to test the application
        </p>
      </div>

      {demoCredentials.map((cred) => {
        const IconComponent = cred.icon;
        return (
          <Card key={cred.role} className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <IconComponent className="h-4 w-4" />
                {cred.role} Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email:</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {cred.email}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(cred.email, 'Email')}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Password:</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {cred.password}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(cred.password, 'Password')}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};