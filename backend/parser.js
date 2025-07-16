function extractIntent(message) {
  const lower = message.toLowerCase();

  // === SITE DETECTION ===
  const knownSites = ["amazon", "tesco", "google"];
  const site = knownSites.find((s) => lower.includes(s)) || null;

  // === ACTION DETECTION ===
  const knownActions = ["search", "buy", "add", "open", "checkout"];
  const action = knownActions.find((a) => lower.includes(a)) || "search";

  // === OBJECT DETECTION ===
  let object = null;

  const patterns = [
    /search\s+(?:on\s+\w+\s+)?(?:for\s+)?(.+?)(?:\s+under|\s+below|\s+less|$)/,
    /buy\s+(.*?)(?:\s+under|\s+below|\s+less|$)/,
    /add\s+(.*?)(?:\s+to|$)/,
    /for\s+(.*?)(?:\s+under|\s+below|\s+less|$)/,
  ];

  for (const pattern of patterns) {
    const match = lower.match(pattern);
    if (match && match[1]) {
      object = match[1].trim();
      break;
    }
  }

  // === CONSTRAINT DETECTION ===
  const constraints = {};
  const priceMatch = lower.match(/(?:under|below|less than)\s+(\d+)/);
  if (priceMatch) {
    constraints.price = `<=${priceMatch[1]}`;
  }

  return {
    action,
    site,
    object,
    constraints
  };
}

module.exports = { extractIntent };
