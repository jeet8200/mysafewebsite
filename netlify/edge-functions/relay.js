const TARGET_BASE = (Netlify.env.get("TARGET_DOMAIN") || "").replace(/\/$/, "");

const STRIP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "forwarded",
  "x-forwarded-host",
  "x-forwarded-proto",
  "x-forwarded-port",
]);

export default async function handler(request, context) {
  if (!TARGET_BASE) {
    return new Response(null, { status: 404 });
  }

  try {
    const url = new URL(request.url);
    const targetUrl = new URL(url.pathname + url.search, TARGET_BASE);

    const newHeaders = new Headers(request.headers);
    
    for (const [key] of request.headers) {
      const k = key.toLowerCase();
      if (STRIP_HEADERS.has(k) || k.startsWith("x-nf-") || k.startsWith("x-netlify-")) {
        newHeaders.delete(key);
      }
    }

    // Set origin host for backend compatibility
    const targetHost = new URL(TARGET_BASE).host;
    newHeaders.set("host", targetHost);

    // Forward client reference for analytics
    newHeaders.set("x-forwarded-for", context.ip);

    const fetchOptions = {
      method: request.method,
      headers: newHeaders,
      redirect: "manual",
      duplex: "half", 
    };

    if (request.body && request.method !== "GET" && request.method !== "HEAD") {
      fetchOptions.body = request.body;
    }

    const upstream = await fetch(targetUrl.toString(), fetchOptions);

    const responseHeaders = new Headers(upstream.headers);
    responseHeaders.delete("transfer-encoding");
    responseHeaders.delete("connection");
    
    // Standard caching policy for dynamic content
    responseHeaders.set("cache-control", "no-store, no-cache, must-revalidate");

    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });

  } catch (error) {
    return new Response(null, { status: 404 });
  }
}
