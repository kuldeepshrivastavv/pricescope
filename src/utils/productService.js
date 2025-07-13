import { supabase } from './supabase';

class ProductService {
  // Add new product for tracking
  async addProduct(productData) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...productData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Add initial price history entry
      if (data?.id && productData?.current_price) {
        await this.addPriceHistory(data.id, productData.current_price);
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      throw error;
    }
  }

  // Get user's products
  async getUserProducts(userId, filters = {}) {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          price_alerts(id, target_price, alert_type, status),
          price_history(price, recorded_at, trend)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.platform && filters.platform !== 'all') {
        query = query.eq('platform', filters.platform);
      }

      if (filters?.available !== undefined) {
        query = query.eq('is_available', filters.available);
      }

      const { data, error } = await query;

      if (error) {
        return { success: false, error: error.message };
      }

      // Calculate additional fields for each product
      const enrichedProducts = data?.map(product => {
        const priceHistory = product?.price_history || [];
        const originalPrice = priceHistory?.length > 0 ? priceHistory[0]?.price : product?.current_price;
        const priceChange = originalPrice && product?.current_price 
          ? ((product.current_price - originalPrice) / originalPrice) * 100 
          : 0;

        return {
          ...product,
          original_price: originalPrice,
          price_change: priceChange,
          has_alert: product?.price_alerts?.length > 0,
          lowest_price: Math.min(...(priceHistory?.map(h => h.price) || [product?.current_price || 0])),
          highest_price: Math.max(...(priceHistory?.map(h => h.price) || [product?.current_price || 0]))
        };
      });

      return { success: true, data: enrichedProducts || [] };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      throw error;
    }
  }

  // Get single product with full details
  async getProduct(productId) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          price_alerts(*),
          price_history(*)
        `)
        .eq('id', productId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      throw error;
    }
  }

  // Update product
  async updateProduct(productId, updates) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      throw error;
    }
  }

  // Delete product
  async deleteProduct(productId) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      throw error;
    }
  }

  // Add price history entry
  async addPriceHistory(productId, price, isAvailable = true) {
    try {
      const { data, error } = await supabase
        .rpc('update_price_history', {
          product_uuid: productId,
          new_price: price,
          availability: isAvailable
        });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      throw error;
    }
  }

  // Get price history for a product
  async getPriceHistory(productId, days = 30) {
    try {
      const { data, error } = await supabase
        .from('price_history')
        .select('*')
        .eq('product_id', productId)
        .gte('recorded_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: true });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      throw error;
    }
  }

  // Parse product URL to extract platform and details
  async parseProductUrl(url) {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      let platform = 'other';
      if (hostname.includes('amazon')) platform = 'amazon';
      else if (hostname.includes('flipkart')) platform = 'flipkart';
      else if (hostname.includes('myntra')) platform = 'myntra';
      else if (hostname.includes('croma')) platform = 'croma';

      // In a real implementation, this would scrape the product details
      // For now, we'll return mock data structure
      return {
        success: true,
        data: {
          platform,
          url: url,
          name: 'Product from URL',
          description: 'Parsed product description',
          current_price: 99.99,
          image_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center',
          category: 'General',
          brand: 'Unknown'
        }
      };
    } catch (error) {
      return { 
        success: false, 
        error: 'Invalid URL provided. Please enter a valid product URL.' 
      };
    }
  }

  // Get dashboard statistics
  async getDashboardStats(userId) {
    try {
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, current_price, original_price')
        .eq('user_id', userId);

      if (productsError) {
        return { success: false, error: productsError.message };
      }

      const { data: alerts, error: alertsError } = await supabase
        .from('price_alerts')
        .select('id, status')
        .eq('user_id', userId)
        .eq('status', 'active');

      if (alertsError) {
        return { success: false, error: alertsError.message };
      }

      const totalProducts = products?.length || 0;
      const activeAlerts = alerts?.length || 0;
      const recentDrops = products?.filter(p => p?.current_price < p?.original_price)?.length || 0;
      const totalSavings = products?.reduce((sum, p) => {
        const savings = (p?.original_price || 0) - (p?.current_price || 0);
        return sum + (savings > 0 ? savings : 0);
      }, 0) || 0;

      return {
        success: true,
        data: {
          totalProducts,
          activeAlerts,
          recentDrops,
          totalSavings
        }
      };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      throw error;
    }
  }
}

export default new ProductService();