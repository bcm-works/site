package main

func TaskDeps() {
	LogInfo("Updating Deno dependencies")
	Cmd("deno task update")

	LogInfo("Committing the results")
	Cmd("git add deno.json deno.lock && git commit -m \"Update third-party dependencies\" || true")
}
