export async function GET(req) {
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL; // http://123.234.23.43:8000
  const path = req.nextUrl.pathname.replace("/api/proxy", "");
  const targetUrl = `${backend}${path}`;

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        ...Object.fromEntries(req.headers),
      },
    });

    const data = await response.text();
    return new Response(data, { status: response.status });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Proxy GET failed" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL; 
  const path = req.nextUrl.pathname.replace("/api/proxy", "");
  const targetUrl = `${backend}${path}`;

  try {
    // Detect if request is multipart form (file upload)
    const contentType = req.headers.get("content-type") || "";

    let body;

    if (contentType.includes("multipart/form-data")) {
      // PDF upload
      const formData = await req.formData();
      body = formData;
    } else {
      // JSON body
      body = await req.text();
    }

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: Object.fromEntries(req.headers),
      body,
    });

    const text = await response.text();
    return new Response(text, { status: response.status });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Proxy POST failed" }), {
      status: 500,
    });
  }
}
