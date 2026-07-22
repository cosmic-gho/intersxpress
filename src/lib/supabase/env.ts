const PLACEHOLDER_PATTERNS = ["your-", "replace-", "example"];

function hasPlaceholder(value: string) {
  const normalized = value.trim().toLowerCase();
  return PLACEHOLDER_PATTERNS.some((pattern) => normalized.includes(pattern));
}

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function getRawPublicEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "",
  };
}

export function isSupabaseConfigured() {
  const env = getRawPublicEnv();

  return Boolean(
    env.url &&
      env.anonKey &&
      !hasPlaceholder(env.url) &&
      !hasPlaceholder(env.anonKey) &&
      isValidUrl(env.url),
  );
}

export function getSupabasePublicEnv() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  return getRawPublicEnv();
}

export function hasSupabaseServiceRole() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
  return Boolean(serviceRoleKey && !hasPlaceholder(serviceRoleKey));
}

export function getSupabaseServiceRoleEnv() {
  const publicEnv = getSupabasePublicEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";

  if (!publicEnv || !hasSupabaseServiceRole()) {
    return null;
  }

  return {
    ...publicEnv,
    serviceRoleKey,
  };
}
