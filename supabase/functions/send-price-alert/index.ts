import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

serve(async (req) => {
  // ✅ CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    });
  }

  try {
    const { to, subject, productName, currentPrice, targetPrice, productUrl } = await req.json();

    // Validate required fields
    if (!to || !productName || !currentPrice || !targetPrice) {
      return new Response(JSON.stringify({
        error: "Missing required fields"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // Send email using Resend API
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: [to],
        subject: subject || `PriceScope Alert: ${productName} price dropped!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
            <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1f2937; margin: 0; font-size: 24px;">🎯 Price Alert Triggered!</h1>
                <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 16px;">PriceScope - Track. Compare. Win.</p>
              </div>
              
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 20px; margin-bottom: 25px;">
                <h2 style="color: #15803d; margin: 0 0 15px 0; font-size: 18px;">Great news! Your target price has been reached</h2>
                <p style="color: #166534; margin: 0; font-size: 16px; font-weight: 600;">${productName}</p>
              </div>

              <div style="background-color: #f8fafc; border-radius: 6px; padding: 20px; margin-bottom: 25px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                  <span style="color: #64748b; font-size: 14px;">Current Price:</span>
                  <span style="color: #0f172a; font-size: 20px; font-weight: bold;">$${currentPrice}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                  <span style="color: #64748b; font-size: 14px;">Your Target Price:</span>
                  <span style="color: #0f172a; font-size: 16px;">$${targetPrice}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="color: #64748b; font-size: 14px;">You Save:</span>
                  <span style="color: #15803d; font-size: 16px; font-weight: 600;">$${(targetPrice - currentPrice).toFixed(2)}</span>
                </div>
              </div>

              <div style="text-align: center; margin-bottom: 25px;">
                <a href="${productUrl || '#'}" 
                   style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                  View Product & Buy Now
                </a>
              </div>

              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                  This alert was sent by PriceScope. You can manage your alerts in your dashboard.
                </p>
              </div>
            </div>
          </div>
        `
      })
    });

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) {
      return new Response(JSON.stringify({
        error: "Failed to send email",
        details: emailResult
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Price alert email sent successfully",
      emailId: emailResult.id
    }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
});