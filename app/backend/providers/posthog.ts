import { logError } from "$be/log.ts";
import { Env } from "$be/env.ts";
import { PostHog } from "posthog";

export class PostHogProvider {
  private static readonly scannerPathParts: string[] = [
    ".env",
    ".git",
    ".aws",
    ".ssh",
    ".php",
    "wp-admin",
    "wp-login",
    "wp-content",
    "phpmyadmin"
  ];

  constructor(private env: Env) {}

  private isScannerPath(pathname: string): boolean {
    const path = pathname.toLowerCase();
    return PostHogProvider.scannerPathParts.some((part) => path.includes(part));
  }

  public async postHogAnonBackendEvent(
    statusCode: number,
    eventRequest: Request,
    eventData: Record<string, string | number | undefined> = {}
  ): Promise<void> {
    const postHogId: string = this.env.get("SITE_POSTHOG_ID", "");
    const postHogApiHost: string = this.env.get("SITE_POSTHOG_API_HOST", "");
    const eventActor: string = `${this.env.getSiteEnv()}-backend-anon-event`;
    const eventPath: string = new URL(eventRequest.url).pathname;
    const eventContent: string = `${statusCode} ${eventPath}`;

    if (this.isScannerPath(eventPath)) {
      logError(`postHogAnonBackendEvent skipped scanner path [${eventActor}] ${eventContent}`);
      return;
    }

    if (postHogId) {
      const postHogClient = new PostHog(
        postHogId,
        {
          host: postHogApiHost
        }
      );

      // Capture a normal event, not an exception, so the path stays off the
      // fingerprint and no per-URL error tracking issue is created.
      postHogClient.capture({
        distinctId: eventActor,
        event: "backend_response",
        properties: {
          status_code: statusCode,
          path: eventPath,
          ...eventData
        }
      });

      // Flush and close the per-request client so its timer does not linger.
      await postHogClient.shutdown();

      logError(`postHogAnonBackendEvent sent [${eventActor}] ${eventContent}`);
    } else {
      logError(`postHogAnonBackendEvent skipped [${eventActor}] ${eventContent}`);
    }
  }
}
