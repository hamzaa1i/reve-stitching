const rateLimits = /* @__PURE__ */ new Map();
function checkRateLimit(ip, max = 5, windowMs = 6e4) {
  const now = Date.now();
  const windowStart = now - windowMs;
  if (rateLimits.size > 1e4) {
    for (const [key, timestamps] of rateLimits) {
      const recent2 = timestamps.filter((t) => t > windowStart);
      if (recent2.length === 0) rateLimits.delete(key);
    }
  }
  const attempts = rateLimits.get(ip) || [];
  const recent = attempts.filter((t) => t > windowStart);
  if (recent.length >= max) return false;
  recent.push(now);
  rateLimits.set(ip, recent);
  return true;
}
function getClientIp(request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip")?.trim() || "unknown";
}
const HTML_TAG_REGEX = /<[^>]*>/g;
function sanitizeString(input) {
  return input.replace(HTML_TAG_REGEX, "").trim();
}
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function isValidEmail(email) {
  return EMAIL_REGEX.test(email.trim().toLowerCase());
}
function truncate(input, maxLength) {
  return input.length <= maxLength ? input : input.substring(0, maxLength);
}

export { checkRateLimit as c, getClientIp as g, isValidEmail as i, sanitizeString as s, truncate as t };
