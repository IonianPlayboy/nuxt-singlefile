import { describe, it, expect, vi, afterEach } from "vitest";
import { generateSingleFileRenderContext } from "@/src/runtime/utils/generateSingleFileRenderContext";
import type { NuxtRenderHTMLContext } from "nuxt/dist/core/runtime/nitro/renderer";

const CORRECT_PATH_TO_FILES = "/path/to/files";
const FIRST_JS_FILE = "test-file.js";
const SECOND_JS_FILE = "index2.js";
const FIRST_CSS_FILE = "index.css";
const SECOND_CSS_FILE = "test-file2.css";

const BASIC_HTML_RENDER_CONTEXT: NuxtRenderHTMLContext = {
	island: false,
	htmlAttrs: [],
	head: [
		`<script src="./${FIRST_JS_FILE}" type="module"></script>`,
		`<link rel="stylesheet" href="./${FIRST_CSS_FILE}">`,
	],
	bodyAttrs: [],
	bodyPrepend: [],
	body: ["<div></div>"],
	bodyAppend: [
		'<script type="application/json"">[{"test":true}]</script>\n<script>window.__NUXT__={};window.__NUXT__.config={testing:true}}</script>',
	],
};

describe("generateSingleFileRenderContext", () => {
	vi.mock("node:fs/promises", async () => ({
		...(await vi.importActual<typeof import("node:fs/promises")>(
			"node:fs/promises",
		)),
		readFile: vi.fn(async (...params: Array<string>) =>
			params[0].startsWith(CORRECT_PATH_TO_FILES)
				? Promise.resolve(`mocked file content for ${params[0]}`)
				: Promise.reject(`invalid path: ${params[0]}`),
		),
	}));

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should generate a new render context with inlined head content", async () => {
		const baseHtmlRenderContext = BASIC_HTML_RENDER_CONTEXT;

		const result = await generateSingleFileRenderContext(
			baseHtmlRenderContext,
			CORRECT_PATH_TO_FILES,
		);

		expect(result).toEqual({
			...baseHtmlRenderContext,
			head: expect.arrayContaining([
				expect.stringContaining(`<script type="module">`),
				expect.stringContaining(`<style>`),
			]),
		});
		expect(result.head).toEqual(
			expect.arrayContaining([
				expect.stringContaining(`/${FIRST_JS_FILE}`),
				expect.stringContaining(`/${FIRST_CSS_FILE}`),
			]),
		);
	});

	it("should generate a new render context with mixed inlined head content", async () => {
		const baseHtmlRenderContext = {
			...BASIC_HTML_RENDER_CONTEXT,
			head: [
				'<meta charset="utf-8">',
				'<meta name="viewport" content="width=device-width, initial-scale=1">',
				`<script src="./${FIRST_JS_FILE}"></script>`,
				`<link rel="stylesheet" href="./${FIRST_CSS_FILE}">`,
				`<script src="./${SECOND_JS_FILE}"></script>`,
				`<link rel="stylesheet" href="./${SECOND_CSS_FILE}">`,
			],
		};

		const result = await generateSingleFileRenderContext(
			baseHtmlRenderContext,
			CORRECT_PATH_TO_FILES,
		);

		expect(result).toEqual({
			...baseHtmlRenderContext,
			head: expect.arrayContaining([
				'<meta charset="utf-8">',
				'<meta name="viewport" content="width=device-width, initial-scale=1">',
				expect.stringContaining(`<script type="module">`),
				expect.stringContaining(`<style>`),
				expect.stringContaining(`<script type="module">`),
				expect.stringContaining(`<style>`),
			]),
		});
		expect(result.head).toEqual(
			expect.arrayContaining([
				expect.stringContaining(`/${FIRST_JS_FILE}`),
				expect.stringContaining(`/${FIRST_CSS_FILE}`),
				expect.stringContaining(`/${SECOND_JS_FILE}`),
				expect.stringContaining(`/${SECOND_CSS_FILE}`),
			]),
		);
	});

	it("should return the same render context if no tags are found", async () => {
		const baseHtmlRenderContext = {
			...BASIC_HTML_RENDER_CONTEXT,
			head: [
				'<meta charset="utf-8">',
				'<meta name="viewport" content="width=device-width, initial-scale=1">',
			],
		};

		const result = await generateSingleFileRenderContext(
			baseHtmlRenderContext,
			CORRECT_PATH_TO_FILES,
		);

		expect(result).toEqual(baseHtmlRenderContext);
	});

	it("should throw an error if the path to build is invalid", async () => {
		const pathToBuild = "invalid/path/to/build";

		const baseHtmlRenderContext = BASIC_HTML_RENDER_CONTEXT;

		await expect(
			generateSingleFileRenderContext(baseHtmlRenderContext, pathToBuild),
		).rejects.toThrow(expect.stringContaining(pathToBuild));
	});
});
