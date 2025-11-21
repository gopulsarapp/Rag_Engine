import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL!;

  let path = req.nextUrl.pathname.replace("/api/proxy", "");
  if (!path.startsWith("/")) path = "/" + path;

  const target = backend + path;

  const response = await fetch(target);
  const data = await response.text();

  return new Response(data, { status: response.status });
}

export async function POST(req: NextRequest) {
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL!;

  let path = req.nextUrl.pathname.replace("/api/proxy", "");
  if (!path.startsWith("/")) path = "/" + path;

  const target = backend + path;

  const contentType = req.headers.get("content-type") || "";
  let body: any;

  if (contentType.includes("multipart/form-data")) {
    body = await req.formData();
  } else {
    body = await req.text();
  }

  const response = await fetch(target, {
    method: "POST",
    body,
    headers: { "content-type": contentType }
  });

  const data = await response.text();
  return new Response(data, { status: response.status });
}
