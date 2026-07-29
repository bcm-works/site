import { assertEquals, assertNotEquals } from "@std/assert";

async function commandOutput(command: string, args: string[]): Promise<string> {
  const output = await new Deno.Command(command, {
    args,
    stderr: "piped",
    stdout: "piped",
  }).output();

  if (!output.success) {
    const stderr = new TextDecoder().decode(output.stderr).trim();
    assertEquals(stderr || `${command} ${args.join(" ")} failed`, "");
  }

  return new TextDecoder().decode(output.stdout).trim();
}

async function inspectImage(tag: string): Promise<Record<string, unknown>> {
  const imageJson = await commandOutput("docker", [
    "image",
    "inspect",
    tag,
    "--format={{json .}}",
  ]);

  assertNotEquals(imageJson, "");

  return JSON.parse(imageJson);
}

Deno.test("DOCKER BUILD", async (test) => {
  await test.step({
    name: "check 'bcm-site:latest'",
    fn: async () => {
      const image = await inspectImage("bcm-site:latest");

      assertNotEquals(image.Id, "");
    },
  });

  await test.step({
    name: "check Docker image starts the Deno server",
    fn: async () => {
      const image = await inspectImage("bcm-site:latest");
      const config = image.Config as Record<string, unknown>;

      assertEquals(config.User, "deno");
      assertEquals(config.Cmd, ["deno", "task", "start"]);
    },
  });

  await test.step({
    name: "check Docker image exposes port 8000",
    fn: async () => {
      const image = await inspectImage("bcm-site:latest");
      const config = image.Config as Record<string, unknown>;
      const exposedPorts = config.ExposedPorts as Record<string, unknown>;

      assertNotEquals(exposedPorts["8000/tcp"], undefined);
    },
  });
});
