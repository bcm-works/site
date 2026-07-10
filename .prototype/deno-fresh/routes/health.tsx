import { define } from "../utils.ts";

// Return 200 OK for /health requests

export const handler = define.handlers({
  GET() {
    return new Response(
      `OK`,
      {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );
  },
});
