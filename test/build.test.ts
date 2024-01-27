import { describe, it, expect } from "vitest";
import { fileURLToPath } from "node:url";
import { buildNuxtApp, getOutputFiles } from "@/test/utils";

const ROOT_DIR = fileURLToPath(new URL("./fixtures/basic", import.meta.url));

//TODO: Explore how we can test the generated HTML file
// Need also to investigate if the programmatic build has a different output than the CLI build
describe("nuxt-singlefile", async () => {
	await buildNuxtApp({
		rootDir: ROOT_DIR,
	});

	it("builds without throwing an error", async () => {
		expect(true).toBe(true);
	});
	it("generates an html file", async () => {
		const outputFiles = await getOutputFiles({
			rootDir: ROOT_DIR,
		});

		expect(outputFiles).toSatisfy((files: string[]) =>
			files.some((file) => file.includes("index.html")),
		);
	});
	it("generates only one html file", async () => {
		const outputFiles = await getOutputFiles({
			rootDir: ROOT_DIR,
		});

		expect(outputFiles).toSatisfy(
			(files: string[]) =>
				files.filter((file) => file.includes(".html")).length === 1,
		);
	});
});
