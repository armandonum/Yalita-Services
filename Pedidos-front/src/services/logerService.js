// loggerService.js
const logged = new Set();

export function warnOnce(key, message) {
  if (!logged.has(key)) {
    console.warn(message);
    logged.add(key);
  }
}
