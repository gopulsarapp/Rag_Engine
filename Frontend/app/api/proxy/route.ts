import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL!;
  
  let path = req.nextUrl.pathname.replace("/api/proxy", "");
  if (!path.startsWith("/")) path = "/" + path;

  const target = backend + path;

  try {
    const response = await fetch(target, { method: "GET" });
    const data = await response.text();

    return new Response(data, { status: response.status });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Proxy GET failed" }), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL!;
  
  let path = req.nextUrl.pathname.replace("/api/proxy", "");
  if (!path.startsWith("/")) path = "/" + path;

  const target = backend + path;

  try {
    const contentType = req.headers.get("content-type") || "";
    let body: FormData | string;

    if (contentType.includes("multipart/form-data")) {
      body = await req.formData();
    } else {
      body = await req.text();
    }

    const response = await fetch(target, {
      method: "POST",
      body,
      headers: {
        "content-type": contentType,
      },
    });

    const text = await response.text();
    return new Response(text, { status: response.status });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Proxy POST failed" }), {
      status: 500,
    });
  }
}
