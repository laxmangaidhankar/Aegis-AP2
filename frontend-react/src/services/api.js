const API_BASE = '/api';

export async function sendChatMessage(message, conversationHistory = []) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, conversationHistory })
  });

  if (!response.ok) {
    throw new Error(`Chat API error: ${response.statusText}`);
  }

  return await response.json();
}

export async function fetchProducts() {
  const response = await fetch(`${API_BASE}/merchant/products`);
  if (!response.ok) throw new Error('Failed to fetch product catalog');
  return await response.json();
}

export async function fetchMerchantPolicy() {
  const response = await fetch(`${API_BASE}/merchant/policy`);
  if (!response.ok) throw new Error('Failed to fetch merchant policy');
  return await response.json();
}

export async function updateMerchantPolicy(policy) {
  const response = await fetch(`${API_BASE}/merchant/policy`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(policy)
  });
  if (!response.ok) throw new Error('Failed to update merchant policy');
  return await response.json();
}

export async function fetchAuditLogs() {
  const response = await fetch(`${API_BASE}/audit`);
  if (!response.ok) throw new Error('Failed to fetch audit log');
  return await response.json();
}
