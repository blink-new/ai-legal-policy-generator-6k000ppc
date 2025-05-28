// Try both /functions/v1/generate-policy and /api/generate-policy for local/dev/prod compatibility
export async function generatePolicy({ businessDescription, policyType, industry }: { businessDescription: string, policyType: string, industry: string }) {
  let res;
  try {
    res = await fetch("/functions/v1/generate-policy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessDescription, policyType, industry })
    });
    // If we get a 404 or HTML, try /api/generate-policy
    if (res.status === 404 || res.headers.get('content-type')?.includes('text/html')) {
      res = await fetch("/api/generate-policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessDescription, policyType, industry })
      });
    }
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await res.text();
      throw new Error('Unexpected response: ' + text.substring(0, 100));
    }
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to generate policy');
    }
    return data.policy;
  } catch (err) {
    throw new Error(err.message || 'Failed to generate policy');
  }
}
