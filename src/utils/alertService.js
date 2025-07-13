import { supabase } from './supabase';

class AlertService {
  // Create new price alert
  async createAlert(alertData) {
    try {
      const { data, error } = await supabase
        .from('price_alerts')
        .insert([{
          ...alertData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
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

  // Get user's alerts
  async getUserAlerts(userId, filters = {}) {
    try {
      let query = supabase
        .from('price_alerts')
        .select(`
          *,
          products(id, name, current_price, image_url, platform)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters?.alert_type && filters.alert_type !== 'all') {
        query = query.eq('alert_type', filters.alert_type);
      }

      const { data, error } = await query;

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

  // Update alert
  async updateAlert(alertId, updates) {
    try {
      const { data, error } = await supabase
        .from('price_alerts')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', alertId)
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

  // Delete alert
  async deleteAlert(alertId) {
    try {
      const { error } = await supabase
        .from('price_alerts')
        .delete()
        .eq('id', alertId);

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

  // Check for triggered alerts (used by background jobs)
  async checkTriggeredAlerts(productId) {
    try {
      const { data, error } = await supabase
        .rpc('check_price_alerts', { product_uuid: productId });

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

  // Mark alert as triggered
  async markAlertTriggered(alertId) {
    try {
      const { data, error } = await supabase
        .from('price_alerts')
        .update({
          status: 'triggered',
          triggered_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', alertId)
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

  // Get alert statistics
  async getAlertStats(userId) {
    try {
      const { data, error } = await supabase
        .from('price_alerts')
        .select('status, alert_type')
        .eq('user_id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      const stats = {
        total: data?.length || 0,
        active: data?.filter(a => a?.status === 'active')?.length || 0,
        triggered: data?.filter(a => a?.status === 'triggered')?.length || 0,
        paused: data?.filter(a => a?.status === 'paused')?.length || 0,
        priceDropAlerts: data?.filter(a => a?.alert_type === 'price_drop')?.length || 0,
        stockAlerts: data?.filter(a => a?.alert_type === 'back_in_stock')?.length || 0
      };

      return { success: true, data: stats };
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

  // Send email notification for price alert
  async sendAlertNotification(alertData) {
    try {
      // Call Supabase Edge Function for sending email
      const { data, error } = await supabase.functions.invoke('send-price-alert', {
        body: {
          to: alertData?.user_email,
          subject: `PriceScope Alert: ${alertData?.product_name} price dropped!`,
          productName: alertData?.product_name,
          currentPrice: alertData?.current_price,
          targetPrice: alertData?.target_price,
          productUrl: alertData?.product_url
        }
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
          error: 'Cannot connect to email service. Please try again later.' 
        };
      }
      throw error;
    }
  }
}

export default new AlertService();