function generateSampleReference() {
  const date = /* @__PURE__ */ new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SR-${dateStr}-${random}`;
}

export { generateSampleReference as g };
