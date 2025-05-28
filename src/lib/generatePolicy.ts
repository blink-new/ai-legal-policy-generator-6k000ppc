export async function generatePolicy({ businessDescription, policyType, industry }: { businessDescription: string, policyType: string, industry: string }) {
  const res = await fetch("/functions/v1/generate-policy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ businessDescription, policyType, industry })
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to generate policy')
  }
  const data = await res.json()
  return data.policy
}
