import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { ProductForm } from './ProductForm';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Product {
  id: string;
  name: string;
  description?: string;
  category_id?: string;
  cost_price: number;
  sell_price: number;
  stock: number;
  min_stock: number;
  barcode?: string;
  image_url?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { userProfile } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);

        if (error) throw error;

        setProducts(products.filter(p => p.id !== productId));
        toast({
          title: 'Success',
          description: 'Product deleted successfully',
        });
      } catch (error: any) {
        console.error('Error deleting product:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete product',
          variant: 'destructive',
        });
      }
    }
  };

  const handleSaveProduct = async (productData: any) => {
    try {
      if (editingProduct) {
        const { data, error } = await supabase
          .from('products')
          .update({
            ...productData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingProduct.id)
          .select()
          .single();

        if (error) throw error;

        setProducts(products.map(p => p.id === editingProduct.id ? data : p));
        toast({
          title: 'Success',
          description: 'Product updated successfully',
        });
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert({
            ...productData,
            created_by: userProfile?.id,
          })
          .select()
          .single();

        if (error) throw error;

        setProducts([data, ...products]);
        toast({
          title: 'Success',
          description: 'Product created successfully',
        });
      }
      
      setShowForm(false);
      setEditingProduct(null);
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        title: 'Error',
        description: `Failed to ${editingProduct ? 'update' : 'create'} product`,
        variant: 'destructive',
      });
    }
  };

  const getProfitMargin = (product: Product) => {
    return ((product.sell_price - product.cost_price) / product.sell_price * 100).toFixed(1);
  };

  if (showForm) {
    return (
      <ProductForm
        product={editingProduct}
        onSave={handleSaveProduct}
        onCancel={() => {
          setShowForm(false);
          setEditingProduct(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse overflow-hidden">
              <div className="aspect-square bg-muted" />
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-6 bg-muted rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="relative overflow-hidden flex flex-col">
              {product.stock <= product.min_stock && (
                <div className="absolute top-2 right-2 z-10">
                  <Badge variant="destructive" className="flex items-center gap-1 shadow-lg">
                    <AlertTriangle className="h-3 w-3" />
                    Low Stock
                  </Badge>
                </div>
              )}
              
              {/* Product Image */}
              <div className="relative aspect-square bg-muted overflow-hidden">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={`${product.name} - Product image showing details and packaging`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                      e.currentTarget.alt = 'Product image unavailable';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <span className="text-sm">No image</span>
                  </div>
                )}
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-base line-clamp-2">{product.name}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3 flex-1 flex flex-col">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Cost</p>
                    <p className="font-semibold">${product.cost_price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="font-semibold">${product.sell_price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Stock</p>
                    <p className={`font-semibold ${product.stock <= product.min_stock ? 'text-destructive' : ''}`}>
                      {product.stock}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Margin</p>
                    <p className="font-semibold text-green-600">{getProfitMargin(product)}%</p>
                  </div>
                </div>
                
                {product.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                )}
                
                <div className="flex gap-2 pt-2 mt-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(product)}
                    className="flex-1"
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(product.id)}
                    className="flex-1"
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredProducts.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No products found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};