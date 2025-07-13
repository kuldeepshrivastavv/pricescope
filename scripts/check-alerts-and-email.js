// Node.js script to check price alerts and send email notifications
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Configure nodemailer (use your real SMTP credentials in production)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your app password
  },
});

async function checkAlertsAndSendEmails() {
  // Get all active alerts
  const { data: alerts } = await supabase.from('alerts').select('*').eq('active', true);
  for (const alert of alerts) {
    // Get latest price for the product
    const { data: priceRows } = await supabase
      .from('price_history')
      .select('price')
      .eq('product_id', alert.product_id)
      .order('timestamp', { ascending: false })
      .limit(1);
    if (!priceRows || priceRows.length === 0) continue;
    const latestPrice = priceRows[0].price;
    if (latestPrice <= alert.target_price) {
      // Get user email
      const { data: user } = await supabase.from('users').select('email').eq('id', alert.user_id).single();
      if (!user) continue;
      // Send email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Price Alert: Your product is now cheaper!',
        text: `The product you are tracking is now ₹${latestPrice} (target: ₹${alert.target_price})`,
      });
      console.log(`Alert sent to ${user.email} for product ${alert.product_id}`);
    }
  }
}

checkAlertsAndSendEmails();
