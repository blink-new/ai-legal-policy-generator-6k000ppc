import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import OpenAI from "npm:openai";

const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  try {
    let businessDescription, policyType, industry;
    try {
      const body = await req.json();
      businessDescription = body.businessDescription;
      policyType = body.policyType;
      industry = body.industry;
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON input." }), { status: 400, headers: corsHeaders() });
    }
    if (!businessDescription || !policyType || !industry) {
      return new Response(JSON.stringify({ error: "Missing required fields." }), { status: 400, headers: corsHeaders() });
    }

    // Compose the prompt
    const prompt = `You are a legal expert. Generate a detailed, professional ${policyType.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())} for a business in the ${industry} industry.\n\nBusiness Description: ${businessDescription}\n\nThe policy should be clear, comprehensive, and tailored to the business. Include all standard sections and disclaimers. Format as plain text.`;

    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: [
          { role: "system", content: "You are a legal expert and policy writer." },
          { role: "user", content: prompt }
        ],
        max_tokens: 1800,
        temperature: 0.3
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "OpenAI API error: " + (err.message || err.toString()) }), { status: 500, headers: corsHeaders() });
    }

    const policy = completion.choices?.[0]?.message?.content || "";
    return new Response(JSON.stringify({ policy }), { status: 200, headers: corsHeaders() });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || "Unknown error." }), { status: 500, headers: corsHeaders() });
  }
});
