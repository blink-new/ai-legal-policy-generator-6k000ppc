const SUPABASE_FUNCTION_URL = 'https://wmgmovyyfdkglrnauzjn.functions.supabase.co/generate-policy';

export async function generatePolicy({ businessDescription, policyType, industry }: { businessDescription: string, policyType: string, industry: string }) {
  const res = await fetch(SUPABASE_FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ businessDescription, policyType, industry })
  })
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error('Unexpected response from server. Please try again or contact support.');
  }
  if (!res.ok) {
    throw new Error(data.error || 'Failed to generate policy')
  }
  return data.policy
}
