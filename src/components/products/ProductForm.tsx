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
  category: z.string().min(1, 'Category is required'),
  costPrice: z.number().min(0.01, 'Cost price must be greater than 0'),
  sellPrice: z.number().min(0.01, 'Sell price must be greater than 0'),
  stock: z.number().min(0, 'Stock cannot be negative'),
  minStock: z.number().min(0, 'Minimum stock cannot be negative'),
  description: z.string().optional(),
}).refine((data) => data.sellPrice > data.costPrice, {
  message: "Sell price must be greater than cost price",
  path: ["sellPrice"],
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
      category: product.category,
      costPrice: product.costPrice,
      sellPrice: product.sellPrice,
      stock: product.stock,
      minStock: product.minStock,
      description: product.description || '',
    } : {
      name: '',
      category: '',
      costPrice: 0,
      sellPrice: 0,
      stock: 0,
      minStock: 0,
      description: '',
    },
  });

  const costPrice = watch('costPrice');
  const sellPrice = watch('sellPrice');
  const profitMargin = sellPrice > 0 ? ((sellPrice - costPrice) / sellPrice * 100).toFixed(1) : '0';

  const onSubmit = (data: ProductFormData) => {
    const productData: Product = {
      id: product?.id || '',
      name: data.name,
      category: data.category,
      costPrice: data.costPrice,
      sellPrice: data.sellPrice,
      stock: data.stock,
      minStock: data.minStock,
      description: data.description,
      createdAt: product?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    
    onSave(productData);
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
            <div className="grid gap-4 md:grid-cols-2">
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

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="Enter product category"
                  {...register('category')}
                />
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="costPrice">Cost Price ($)</Label>
                <Input
                  id="costPrice"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('costPrice', { valueAsNumber: true })}
                />
                {errors.costPrice && (
                  <p className="text-sm text-destructive">{errors.costPrice.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellPrice">Sell Price ($)</Label>
                <Input
                  id="sellPrice"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('sellPrice', { valueAsNumber: true })}
                />
                {errors.sellPrice && (
                  <p className="text-sm text-destructive">{errors.sellPrice.message}</p>
                )}
              </div>
            </div>

            {sellPrice > 0 && costPrice > 0 && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Profit Margin: <span className="font-medium text-green-600">{profitMargin}%</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Profit per unit: <span className="font-medium">${(sellPrice - costPrice).toFixed(2)}</span>
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
                <Label htmlFor="minStock">Minimum Stock Alert</Label>
                <Input
                  id="minStock"
                  type="number"
                  placeholder="0"
                  {...register('minStock', { valueAsNumber: true })}
                />
                {errors.minStock && (
                  <p className="text-sm text-destructive">{errors.minStock.message}</p>
                )}
              </div>
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