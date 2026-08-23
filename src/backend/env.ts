import { parse as envParse } from "@std/dotenv";
import { logError } from "@/backend/log.ts";
import { format as dateInFormat } from "date-fns";
import { PostHog } from "posthog";

export class Env {
  private buildId: string;
  private env: Record<string, string> = {};
  private envFileDefault: string = "./.env";

  constructor(envFile: string = this.envFileDefault) {
    // Attempt to load the env file, fall back to using the system env vars
    try {
      this.env = envParse(Deno.readTextFileSync(envFile));
    } catch (_error: unknown) {
      this.env = Deno.env.toObject();
    }

    this.buildId = this.get("SITE_BUILD_ID", dateInFormat(new Date(), "yyyyMMddHHmmss"));
  }

  public get(varName: string, defaultValue?: string): string {
    return this.env[varName] || defaultValue || "";
  }

  public has(varName: string): boolean {
    return this.get(varName) !== undefined;
  }

  public getNumber(varName: string, defaultValue?: number): number {
    if (defaultValue) {
      return Number(this.get(varName)) || defaultValue;
    }

    return Number(this.get(varName)) || 0;
  }

  public getSiteEnv(): string {
    return this.get("SITE_ENV", "other");
  }

  public isLocal(): boolean {
    return this.get("SITE_ENV", "other") == "local";
  }

  public getUrl(): string {
    if (this.isLocal()) {
      const port = this.getPort();
      return `http://localhost:${port}`;
    }

    return this.get("SITE_URL", "https://bcm.works");
  }

  public getPort(): number {
    const sysPort = this.getNumber("PORT", 0);

    if (sysPort > 0) {
      return sysPort;
    }

    return this.getNumber("SITE_PORT", 8000);
  }

  public getBuildDir(): string {
    return this.get("SITE_BUILD_DIR", "build");
  }

  public getPublicDir(): string {
    return this.get("SITE_PUBLIC_DIR", "public");
  }

  public getBuildId(): string {
    return this.buildId;
  }

  public postHogAnonBackendEvent(
    statusCode: number,
    eventRequest: Request,
    eventData: Record<string, string | number | undefined> = { "data": "" }
  ): void {
    const postHogId: string = this.get("SITE_POSTHOG_ID", "");
    const postHogApiHost: string = this.get("SITE_POSTHOG_API_HOST", "");
    const eventActor: string = `${this.getSiteEnv()}-backend-anon-event`;
    const eventContent: string = `${statusCode} ${eventRequest.url}`;

    if (postHogId) {
      const postHogClient = new PostHog(
        postHogId,
        {
          host: postHogApiHost
        }
      );

      postHogClient.captureException(new Error(eventContent), eventActor, eventData);

      logError(`postHogAnonBackendEvent sent [${eventActor}] ${eventContent}`);
    } else {
      logError(`postHogAnonBackendEvent skipped [${eventActor}] ${eventContent}`);
    }
  }
}
