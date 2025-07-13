// Supabase Edge Function (Deno) for sending email alerts
import { serve } from 'std/server';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));

serve(async (req) => {
  const { email, productName, currentPrice, targetPrice } = await req.json();
  // Send email using Supabase's built-in email or external service
  // This is a placeholder for actual email logic
  const { error } = await supabase.functions.invoke('send-email', {
    body: {
      to: email,
      subject: `Price Alert: ${productName} price dropped!`,
      html: `<h1>${productName} is now ₹${currentPrice} (target: ₹${targetPrice})</h1>`
    }
  });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
