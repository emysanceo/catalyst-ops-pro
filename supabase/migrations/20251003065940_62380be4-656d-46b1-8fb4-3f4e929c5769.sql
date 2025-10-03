-- Add subcategories table
CREATE TABLE IF NOT EXISTS public.subcategories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on subcategories
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

-- RLS policies for subcategories
CREATE POLICY "Everyone can view subcategories" 
ON public.subcategories 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage subcategories" 
ON public.subcategories 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add subcategory_id to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL;

-- Create trigger for subcategories updated_at
CREATE TRIGGER update_subcategories_updated_at
BEFORE UPDATE ON public.subcategories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories for the restaurant
INSERT INTO public.categories (name, description) VALUES
  ('Healthy Breakfast', 'Nutritious breakfast options'),
  ('Quick Bite', 'Fast single item meals'),
  ('Vorpet (Main Meals)', 'Main course dishes'),
  ('Morning Café (Drinks)', 'Beverages and drinks')
ON CONFLICT DO NOTHING;

-- Get category IDs and insert subcategories
DO $$
DECLARE
  breakfast_id UUID;
  quickbite_id UUID;
  vorpet_id UUID;
  drinks_id UUID;
BEGIN
  SELECT id INTO breakfast_id FROM public.categories WHERE name = 'Healthy Breakfast' LIMIT 1;
  SELECT id INTO quickbite_id FROM public.categories WHERE name = 'Quick Bite' LIMIT 1;
  SELECT id INTO vorpet_id FROM public.categories WHERE name = 'Vorpet (Main Meals)' LIMIT 1;
  SELECT id INTO drinks_id FROM public.categories WHERE name = 'Morning Café (Drinks)' LIMIT 1;

  IF breakfast_id IS NOT NULL THEN
    INSERT INTO public.subcategories (category_id, name) VALUES
      (breakfast_id, 'Oats & Cereal'),
      (breakfast_id, 'Egg Dishes'),
      (breakfast_id, 'Bread & Toast');
  END IF;

  IF quickbite_id IS NOT NULL THEN
    INSERT INTO public.subcategories (category_id, name) VALUES
      (quickbite_id, 'Sandwiches'),
      (quickbite_id, 'Snacks'),
      (quickbite_id, 'Pastries');
  END IF;

  IF vorpet_id IS NOT NULL THEN
    INSERT INTO public.subcategories (category_id, name) VALUES
      (vorpet_id, 'Rice Dishes'),
      (vorpet_id, 'Noodles'),
      (vorpet_id, 'Traditional');
  END IF;

  IF drinks_id IS NOT NULL THEN
    INSERT INTO public.subcategories (category_id, name) VALUES
      (drinks_id, 'Hot Drinks'),
      (drinks_id, 'Cold Drinks'),
      (drinks_id, 'Smoothies & Shakes');
  END IF;
END $$;