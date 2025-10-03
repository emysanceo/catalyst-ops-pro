import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/types';
import { ArrowLeft } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  cost_price: z.number().min(0.01, 'Cost price must be greater than 0'),
  sell_price: z.number().min(0.01, 'Sell price must be greater than 0'),
  stock: z.number().min(0, 'Stock cannot be negative'),
  min_stock: z.number().min(0, 'Minimum stock cannot be negative'),
}).refine((data) => data.sell_price > data.cost_price, {
  message: "Sell price must be greater than cost price",
  path: ["sell_price"],
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      description: product.description || '',
      image_url: product.image_url || '',
      cost_price: product.cost_price,
      sell_price: product.sell_price,
      stock: product.stock,
      min_stock: product.min_stock,
    } : {
      name: '',
      description: '',
      image_url: '',
      cost_price: 0,
      sell_price: 0,
      stock: 0,
      min_stock: 0,
    },
  });

  const cost_price = watch('cost_price');
  const sell_price = watch('sell_price');
  const profitMargin = sell_price > 0 ? ((sell_price - cost_price) / sell_price * 100).toFixed(1) : '0';

  const onSubmit = (data: ProductFormData) => {
    onSave(data as any);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
        <h2 className="text-2xl font-bold">
          {product ? 'Edit Product' : 'Add New Product'}
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                placeholder="Enter product name"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cost_price">Cost Price ($)</Label>
                <Input
                  id="cost_price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('cost_price', { valueAsNumber: true })}
                />
                {errors.cost_price && (
                  <p className="text-sm text-destructive">{errors.cost_price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sell_price">Sell Price ($)</Label>
                <Input
                  id="sell_price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('sell_price', { valueAsNumber: true })}
                />
                {errors.sell_price && (
                  <p className="text-sm text-destructive">{errors.sell_price.message}</p>
                )}
              </div>
            </div>

            {sell_price > 0 && cost_price > 0 && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Profit Margin: <span className="font-medium text-green-600">{profitMargin}%</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Profit per unit: <span className="font-medium">${(sell_price - cost_price).toFixed(2)}</span>
                </p>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="stock">Current Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="0"
                  {...register('stock', { valueAsNumber: true })}
                />
                {errors.stock && (
                  <p className="text-sm text-destructive">{errors.stock.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="min_stock">Minimum Stock Alert</Label>
                <Input
                  id="min_stock"
                  type="number"
                  placeholder="0"
                  {...register('min_stock', { valueAsNumber: true })}
                />
                {errors.min_stock && (
                  <p className="text-sm text-destructive">{errors.min_stock.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL (Optional)</Label>
              <Input
                id="image_url"
                type="url"
                placeholder="https://example.com/product-image.jpg"
                {...register('image_url')}
              />
              {errors.image_url && (
                <p className="text-sm text-destructive">{errors.image_url.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Provide a URL to an image for this product
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter product description"
                rows={3}
                {...register('description')}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit">
                {product ? 'Update Product' : 'Create Product'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};