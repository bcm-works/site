// GET /api/health
export function get(): Response {
  return new Response("OK", { status: 200 });
}
