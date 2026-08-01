import { loadSync as envLoad } from "@std/dotenv";
import { fileExists } from "@/common/local.ts";
import { logError } from "@/common/log.ts";
import { format as dateInFormat } from "date-fns";
import { PostHog } from "posthog";

const envFileDefault: string = "./config/.env"

export class Env {
  private envFile: string;
  private buildId: string;
  private env: Record<string, string> | undefined;

  constructor(envFile: string = envFileDefault) {
    this.envFile = envFile;

    if (fileExists(this.envFile)) {
      this.env = envLoad({
        envPath: envFile,
        export: true,
      });
    }

    this.buildId = this.envVar("SITE_BUILD_ID", dateInFormat(new Date(), "yyyyMMddHHmmss"));
  }

  public envVar(varName: string, defaultValue?: string): string {
    return Deno.env.get(varName) || defaultValue || "";
  }

  public hasEnvVar(varName: string): boolean {
    return Deno.env.get(varName) !== undefined;
  }

  public envVarNumber(varName: string, defaultValue?: number): number {
    if (defaultValue) {
      return Number(Deno.env.get(varName)) || defaultValue;
    }

    return Number(Deno.env.get(varName)) || 0;
  }

  public getSiteEnv(): string {
    return this.envVar("SITE_ENV", "other");
  }

  public isLocal(): boolean {
    return this.envVar("SITE_ENV", "other") == "local";
  }

  public getUrl(): string {
    if (this.isLocal()) {
      const port = this.getPort();
      return `http://localhost:${port}`;
    }

    return this.envVar("SITE_URL", "https://bcm.works");
  }

  public getPort(): number {
    const sysPort = this.envVarNumber("PORT", 0);

    if (sysPort > 0) {
      return sysPort;
    }

    return this.envVarNumber("SITE_PORT", 8000);
  }

  public getBuildId(): string {
    return this.buildId;
  }

  public postHogAnonBackendEvent(
    statusCode: number,
    eventRequest: Request,
    eventData: Record<string, string | number | undefined> = { "data": "" },
  ): void {
    const postHogId: string = this.envVar("SITE_POSTHOG_ID", "");
    const postHogApiHost: string = this.envVar("SITE_POSTHOG_API_HOST", "");
    const eventActor: string = `${this.getSiteEnv()}-backend-anon-event`;
    const eventContent: string = `${statusCode} ${eventRequest.url}`;

    if (postHogId) {
      const postHogClient = new PostHog(
        postHogId,
        {
          host: postHogApiHost,
        },
      );

      postHogClient.captureException(new Error(eventContent), eventActor, eventData);

      logError(`postHogAnonBackendEvent sent [${eventActor}] ${eventContent}`);
    } else {
      logError(`postHogAnonBackendEvent skipped [${eventActor}] ${eventContent}`);
    }
  }
}
