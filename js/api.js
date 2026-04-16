// ============================================================
// API Communication Layer
// ============================================================

async function apiGet(action, params = {}) {
  const url = new URL(CONFIG.API_URL);
  url.searchParams.set('action', action);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      url.searchParams.set(k, v);
    }
  });

  try {
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    console.error('API GET error:', err);
    return { error: 'Unable to connect to server. Please try again.' };
  }
}

async function apiPost(action, data = {}) {
  try {
    const res = await fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action, ...data })
    });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    console.error('API POST error:', err);
    return { error: 'Unable to connect to server. Please try again.' };
  }
}
