// VIO API Connection
// This file connects your prototype to your real backend
// Usage: include this before your main script

const VIO_API = 'https://vio-backend-8va0.onrender.com/api';

// Store token after login
function saveToken(token) {
  localStorage.setItem('vio_token', token);
}

function getToken() {
  return localStorage.getItem('vio_token');
}

function saveUser(user) {
  localStorage.setItem('vio_user', JSON.stringify(user));
}

function getSavedUser() {
  const u = localStorage.getItem('vio_user');
  return u ? JSON.parse(u) : null;
}

function clearSession() {
  localStorage.removeItem('vio_token');
  localStorage.removeItem('vio_user');
}

// ── REAL LOGIN ──────────────────────────────────────────────────
async function realLogin(email, password) {
  try {
    const res = await fetch(`${VIO_API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || 'Login failed' };
    }

    saveToken(data.token);
    saveUser(data.user);
    return { success: true, user: data.user, token: data.token };

  } catch (err) {
    // Server is offline - use demo mode
    console.log('Server offline, using demo mode');
    return { success: false, error: 'SERVER_OFFLINE' };
  }
}

// ── REAL REGISTER ───────────────────────────────────────────────
async function realRegister(name, email, password, role, company) {
  try {
    const res = await fetch(`${VIO_API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, company })
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || 'Registration failed' };
    }

    saveToken(data.token);
    saveUser(data.user);
    return { success: true, user: data.user };

  } catch (err) {
    return { success: false, error: 'SERVER_OFFLINE' };
  }
}

// ── GET TASKS ───────────────────────────────────────────────────
async function getTasks() {
  try {
    const res = await fetch(`${VIO_API}/tasks`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const data = await res.json();
    if (!res.ok) return null;
    return data;
  } catch (err) {
    return null;
  }
}

// ── CREATE TASK ─────────────────────────────────────────────────
async function createTask(taskData) {
  try {
    const res = await fetch(`${VIO_API}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(taskData)
    });
    const data = await res.json();
    if (!res.ok) return null;
    return data;
  } catch (err) {
    return null;
  }
}

// ── UPDATE TASK ─────────────────────────────────────────────────
async function updateTask(id, updates) {
  try {
    const res = await fetch(`${VIO_API}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) return null;
    return data;
  } catch (err) {
    return null;
  }
}

console.log('✅ VIO API connector loaded');