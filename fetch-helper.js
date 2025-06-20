/**
 * Universal fetch wrapper for both native (Node 18+) and node-fetch
 *
 * If running on Node 18+, use the native fetch function.
 * Otherwise, load node-fetch dynamically.
 *
 * @param {...*} args Arguments to pass to the fetch function
 * @return {Promise<Response>} Fetch response
 */
async function universalFetch(...args) {
  if (typeof fetch === 'function') {
    // Native fetch (Node 18+)
    return fetch(...args);
  } else {
    // Node < 18: load node-fetch dynamically
    const { default: fetch } = await import('node-fetch');
    return fetch(...args);
  }
}

module.exports = { universalFetch };