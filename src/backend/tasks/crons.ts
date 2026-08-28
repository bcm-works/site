//
//
// Deno Cron Jobs
//   - Overview: https://docs.deno.com/deploy/reference/cron/
//   - API docs: https://docs.deno.com/api/deno/cloud/#Deno.cron
//
//

Deno.cron("health-check", "0 * * * *", async () => {
  const url = 'https://bcm.works/api/health/';
  const response = await fetch(url, { method: "HEAD" });
  const message = `HEALTH-CHECK (${url}): Status ${ response.status }`;

  if (response.status === 200) {
    console.log(`OK ${message}`);
  } else {
    throw new Error(`FAIL ${message}`);
  }
});
