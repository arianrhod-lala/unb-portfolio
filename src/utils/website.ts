export function safeWebsiteUrl(value?: string): string | undefined {
  if (!value || !/^https?:\/\//i.test(value.trim())) return undefined;
  try {
    const url = new URL(value.trim());
    if (!url.hostname || url.username || url.password) return undefined;
    return url.href;
  } catch {
    return undefined;
  }
}
