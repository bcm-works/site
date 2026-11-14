interface StatsProps {
  // Cloudflare Web Analytics - Domain token
  token?: string | undefined;
}

export function Stats({ token }: StatsProps) {
   // Check for the status of the Do Not Track browser setting
  const doNotTrack = typeof navigator !== "undefined" &&
    (navigator.doNotTrack === "1" || navigator.doNotTrack === "yes");

  if (!token || doNotTrack) {
    return null;
  }

  return (
    <script
      type="module"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={`{"token": "${token}"}`}
    />
  );
}
