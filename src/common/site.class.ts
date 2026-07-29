import { loadSync } from "@std/dotenv";
import chalk from "chalk";
import { PostHog } from "posthog";

export class Site {
  private envFile: string;
  private env: Record<string, string> | undefined;

  constructor(envFile: string = "./config/.env") {
    this.envFile = envFile;

    if (this.fileExists(envFile)) {
      // Load variables from ths file, or directly from
      // the build terminal session if they're set there.
      this.env = loadSync({
        envPath: envFile,
        export: true,
      });
    }
  }

  public envVar(varName: string, defaultValue?: string): string {
    return Deno.env.get(varName) || defaultValue || "";
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
      const port = this.envVarNumber("SITE_PORT", 3000);
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

  public fileExists(localFilePath: string): boolean {
    try {
      const localFileCheck = Deno.lstatSync(localFilePath);
      return localFileCheck.isFile;
    } catch (_error) {
      return false;
    }
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

    if (!postHogId) {
      return;
    }

    this.logError(`sending postHogAnonEvent - [${eventActor}] ${eventContent}`);

    const postHogClient = new PostHog(
      postHogId,
      {
        host: postHogApiHost,
      },
    );

    postHogClient.captureException(new Error(eventContent), eventActor, eventData);
  }

  private log(logContent: string | string[]): void {
    if (this.isLocal()) {
      console.log(logContent);
    }
  }

  public logAlways(textContent: string): void {
    console.log(chalk.hex("#D2A6FF")(`${textContent}`));
  }

  public logDebug(textContent: string): void {
    this.log(chalk.hex("#23C5B0")(`DEBUG ${textContent}`));
  }

  public logInfo(textContent: string): void {
    this.log(chalk.blue(textContent));
  }

  public logSuccess(textContent: string): void {
    this.log(chalk.green(textContent));
  }

  public logError(textContent: string): void {
    this.log(chalk.red(textContent));
  }
}
