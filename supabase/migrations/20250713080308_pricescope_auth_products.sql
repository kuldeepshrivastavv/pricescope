-- PriceScope Database Schema with Authentication and Product Tracking
-- Location: supabase/migrations/20250713080308_pricescope_auth_products.sql

-- 1. Types and Enums
CREATE TYPE public.user_role AS ENUM ('admin', 'premium', 'free');
CREATE TYPE public.product_platform AS ENUM ('amazon', 'flipkart', 'myntra', 'croma', 'other');
CREATE TYPE public.alert_type AS ENUM ('price_drop', 'back_in_stock', 'target_price');
CREATE TYPE public.alert_status AS ENUM ('active', 'triggered', 'paused', 'deleted');
CREATE TYPE public.price_trend AS ENUM ('increasing', 'decreasing', 'stable');

-- 2. User Profiles Table (Critical intermediary for auth relationships)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'free'::public.user_role,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{"notifications": true, "currency": "USD", "timezone": "UTC"}'::jsonb,
    subscription_ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products Table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    original_url TEXT NOT NULL,
    platform public.product_platform NOT NULL,
    product_id_on_platform TEXT,
    image_url TEXT,
    category TEXT,
    brand TEXT,
    current_price DECIMAL(10,2),
    original_price DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    is_available BOOLEAN DEFAULT true,
    last_checked TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Price History Table
CREATE TABLE public.price_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    is_available BOOLEAN DEFAULT true,
    recorded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    trend public.price_trend DEFAULT 'stable'::public.price_trend
);

-- 5. Price Alerts Table
CREATE TABLE public.price_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    target_price DECIMAL(10,2) NOT NULL,
    alert_type public.alert_type DEFAULT 'price_drop'::public.alert_type,
    status public.alert_status DEFAULT 'active'::public.alert_status,
    triggered_at TIMESTAMPTZ,
    email_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Product Comparisons Table
CREATE TABLE public.product_comparisons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    product_ids UUID[] NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. User Activity Log
CREATE TABLE public.user_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_products_user_id ON public.products(user_id);
CREATE INDEX idx_products_platform ON public.products(platform);
CREATE INDEX idx_products_last_checked ON public.products(last_checked);
CREATE INDEX idx_price_history_product_id ON public.price_history(product_id);
CREATE INDEX idx_price_history_recorded_at ON public.price_history(recorded_at);
CREATE INDEX idx_price_alerts_user_id ON public.price_alerts(user_id);
CREATE INDEX idx_price_alerts_product_id ON public.price_alerts(product_id);
CREATE INDEX idx_price_alerts_status ON public.price_alerts(status);
CREATE INDEX idx_user_activities_user_id ON public.user_activities(user_id);

-- 9. RLS Setup
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- 10. Helper Functions for RLS
CREATE OR REPLACE FUNCTION public.is_product_owner(product_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = product_uuid AND p.user_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'::public.user_role
)
$$;

CREATE OR REPLACE FUNCTION public.can_access_price_history(product_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = product_uuid AND p.user_id = auth.uid()
)
$$;

-- 11. RLS Policies
CREATE POLICY "users_own_profile" ON public.user_profiles FOR ALL
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "users_own_products" ON public.products FOR ALL
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_own_price_history" ON public.price_history FOR SELECT
USING (public.can_access_price_history(product_id));

CREATE POLICY "users_own_alerts" ON public.price_alerts FOR ALL
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_own_comparisons" ON public.product_comparisons FOR ALL
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_own_activities" ON public.user_activities FOR ALL
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 12. Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'free'::public.user_role)
  );
  RETURN NEW;
END;
$$;

-- 13. Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 14. Function to update price history and detect trends
CREATE OR REPLACE FUNCTION public.update_price_history(
    product_uuid UUID,
    new_price DECIMAL(10,2),
    availability BOOLEAN DEFAULT true
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    previous_price DECIMAL(10,2);
    price_trend_value public.price_trend;
BEGIN
    -- Get the most recent price
    SELECT price INTO previous_price
    FROM public.price_history
    WHERE product_id = product_uuid
    ORDER BY recorded_at DESC
    LIMIT 1;

    -- Determine trend
    IF previous_price IS NULL THEN
        price_trend_value := 'stable'::public.price_trend;
    ELSIF new_price > previous_price THEN
        price_trend_value := 'increasing'::public.price_trend;
    ELSIF new_price < previous_price THEN
        price_trend_value := 'decreasing'::public.price_trend;
    ELSE
        price_trend_value := 'stable'::public.price_trend;
    END IF;

    -- Insert new price record
    INSERT INTO public.price_history (product_id, price, is_available, trend)
    VALUES (product_uuid, new_price, availability, price_trend_value);

    -- Update product current price
    UPDATE public.products
    SET current_price = new_price,
        is_available = availability,
        last_checked = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = product_uuid;
END;
$$;

-- 15. Function to check and trigger price alerts
CREATE OR REPLACE FUNCTION public.check_price_alerts(product_uuid UUID)
RETURNS TABLE(alert_id UUID, user_email TEXT, product_name TEXT, target_price DECIMAL, current_price DECIMAL)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pa.id,
        up.email,
        p.name,
        pa.target_price,
        p.current_price
    FROM public.price_alerts pa
    JOIN public.products p ON pa.product_id = p.id
    JOIN public.user_profiles up ON pa.user_id = up.id
    WHERE pa.product_id = product_uuid
    AND pa.status = 'active'::public.alert_status
    AND (
        (pa.alert_type = 'price_drop'::public.alert_type AND p.current_price <= pa.target_price)
        OR (pa.alert_type = 'back_in_stock'::public.alert_type AND p.is_available = true)
    );
END;
$$;

-- 16. Mock Data for Development
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    user_uuid UUID := gen_random_uuid();
    product1_uuid UUID := gen_random_uuid();
    product2_uuid UUID := gen_random_uuid();
    product3_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with complete field structure
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@pricescope.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'user@pricescope.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Demo User", "role": "premium"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create sample products
    INSERT INTO public.products (id, user_id, name, description, original_url, platform, current_price, original_price, image_url, category, brand) VALUES
        (product1_uuid, user_uuid, 'Apple iPhone 15 Pro Max 256GB Natural Titanium', 'Latest iPhone with titanium design and advanced camera system', 'https://amazon.com/iphone-15-pro-max', 'amazon'::public.product_platform, 1199.99, 1299.99, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop&crop=center', 'Electronics', 'Apple'),
        (product2_uuid, user_uuid, 'Samsung Galaxy S24 Ultra 512GB Titanium Black', 'Premium Android smartphone with S Pen and advanced features', 'https://flipkart.com/samsung-galaxy-s24-ultra', 'flipkart'::public.product_platform, 1099.99, 1199.99, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&crop=center', 'Electronics', 'Samsung'),
        (product3_uuid, admin_uuid, 'Sony WH-1000XM5 Wireless Noise Canceling Headphones', 'Industry-leading noise canceling headphones with premium sound quality', 'https://croma.com/sony-wh-1000xm5', 'croma'::public.product_platform, 349.99, 399.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center', 'Audio', 'Sony');

    -- Create price history
    INSERT INTO public.price_history (product_id, price, recorded_at, trend) VALUES
        (product1_uuid, 1299.99, now() - interval '7 days', 'stable'::public.price_trend),
        (product1_uuid, 1249.99, now() - interval '5 days', 'decreasing'::public.price_trend),
        (product1_uuid, 1199.99, now() - interval '1 day', 'decreasing'::public.price_trend),
        (product2_uuid, 1199.99, now() - interval '10 days', 'stable'::public.price_trend),
        (product2_uuid, 1149.99, now() - interval '6 days', 'decreasing'::public.price_trend),
        (product2_uuid, 1099.99, now() - interval '2 days', 'decreasing'::public.price_trend),
        (product3_uuid, 399.99, now() - interval '14 days', 'stable'::public.price_trend),
        (product3_uuid, 379.99, now() - interval '8 days', 'decreasing'::public.price_trend),
        (product3_uuid, 349.99, now() - interval '3 days', 'decreasing'::public.price_trend);

    -- Create price alerts
    INSERT INTO public.price_alerts (user_id, product_id, target_price, alert_type, status) VALUES
        (user_uuid, product1_uuid, 1100.00, 'price_drop'::public.alert_type, 'active'::public.alert_status),
        (user_uuid, product2_uuid, 1000.00, 'price_drop'::public.alert_type, 'active'::public.alert_status),
        (admin_uuid, product3_uuid, 300.00, 'price_drop'::public.alert_type, 'active'::public.alert_status);

    -- Create user activities
    INSERT INTO public.user_activities (user_id, activity_type, description, metadata) VALUES
        (user_uuid, 'product_added', 'Added iPhone 15 Pro Max to tracking', '{"product_id": "' || product1_uuid || '"}'::jsonb),
        (user_uuid, 'alert_created', 'Set price alert for iPhone 15 Pro Max', '{"product_id": "' || product1_uuid || '", "target_price": 1100.00}'::jsonb),
        (user_uuid, 'price_drop_detected', 'Price dropped on Samsung Galaxy S24 Ultra', '{"product_id": "' || product2_uuid || '", "old_price": 1199.99, "new_price": 1099.99}'::jsonb),
        (admin_uuid, 'product_added', 'Added Sony WH-1000XM5 to tracking', '{"product_id": "' || product3_uuid || '"}'::jsonb);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- 17. Cleanup function for development
CREATE OR REPLACE FUNCTION public.cleanup_demo_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get demo user IDs
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email LIKE '%@pricescope.com';

    -- Delete in dependency order
    DELETE FROM public.user_activities WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.price_alerts WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.product_comparisons WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.price_history WHERE product_id IN (SELECT id FROM public.products WHERE user_id = ANY(auth_user_ids_to_delete));
    DELETE FROM public.products WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;