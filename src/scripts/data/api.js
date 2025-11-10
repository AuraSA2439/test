import { getAccessToken } from '../utils/auth';
import { BASE_URL } from '../config';

const ENDPOINTS = {
  // Auth
  REGISTER: `${BASE_URL}/register`,
  LOGIN: `${BASE_URL}/login`,

  // Story
  STORY_LIST: `${BASE_URL}/stories`,
  STORY_DETAIL: (id) => `${BASE_URL}/stories/${id}`,
  STORE_NEW_STORY: `${BASE_URL}/stories`,
  STORE_NEW_STORY_GUEST: `${BASE_URL}/stories/guest`,

  // Web Push Notifications
  SUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
};

// =====================
// AUTH SECTION
// =====================

export async function getRegistered({ name, email, password }) {
  const data = JSON.stringify({ name, email, password });

  const fetchResponse = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });

  const json = await fetchResponse.json();
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getLogin({ email, password }) {
  const data = JSON.stringify({ email, password });

  const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  });

  const json = await fetchResponse.json();
  return {
    ok: fetchResponse.ok && !json.error,
    message: json.message,
    data: json.loginResult,
  };
}

// =====================
// STORY SECTION
// =====================

export async function getAllPosts({ page, size, location } = {}) {
  const accessToken = getAccessToken();

  const url = new URL(ENDPOINTS.STORY_LIST);
  if (page) url.searchParams.append('page', page);
  if (size) url.searchParams.append('size', size);
  if (location !== undefined) url.searchParams.append('location', location);

  const fetchResponse = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const json = await fetchResponse.json();
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getPostById(id) {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.STORY_DETAIL(id), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const json = await fetchResponse.json();
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function storeNewPost({ description, photo, lat, lon }) {
  const accessToken = getAccessToken();
  const formData = new FormData();

  formData.append('description', description);
  formData.append('photo', photo);
  if (lat) formData.append('lat', lat);
  if (lon) formData.append('lon', lon);

  const fetchResponse = await fetch(ENDPOINTS.STORE_NEW_STORY, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: formData,
  });

  const json = await fetchResponse.json();
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function storeNewPostGuest({ description, photo, lat, lon }) {
  const formData = new FormData();

  formData.append('description', description);
  formData.append('photo', photo);
  if (lat) formData.append('lat', lat);
  if (lon) formData.append('lon', lon);

  const fetchResponse = await fetch(ENDPOINTS.STORE_NEW_STORY_GUEST, {
    method: 'POST',
    body: formData,
  });

  const json = await fetchResponse.json();
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

// =====================
// WEB PUSH NOTIFICATIONS
// =====================

export async function subscribePushNotification({ endpoint, keys: { p256dh, auth } }) {
  const accessToken = getAccessToken();
  const data = JSON.stringify({
    endpoint,
    keys: { p256dh, auth },
  });

  const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: data,
  });

  const json = await fetchResponse.json();
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function unsubscribePushNotification({ endpoint }) {
  const accessToken = getAccessToken();
  const data = JSON.stringify({ endpoint });

  const fetchResponse = await fetch(ENDPOINTS.UNSUBSCRIBE, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: data,
  });

  const json = await fetchResponse.json();
  return {
    ...json,
    ok: fetchResponse.ok,
  };
}
