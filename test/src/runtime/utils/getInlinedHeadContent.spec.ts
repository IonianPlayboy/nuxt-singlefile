import { describe, it, expect, vi, afterEach } from "vitest";
import { getInlinedHeadContent } from "@/src/runtime/utils/getInlinedHeadContent";

const CORRECT_PATH_TO_FILES = "/path/to/files";
const FIRST_JS_FILE = "test-file.js";
const SECOND_JS_FILE = "index2.js";
const FIRST_CSS_FILE = "index.css";
const SECOND_CSS_FILE = "test-file2.css";

describe("getInlinedHeadContent", () => {
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

	it("should inline the content of each tag type in the head HTML", async () => {
		const head = [
			`<script src="./${FIRST_JS_FILE}" type="module"></script>`,
			`<link rel="stylesheet" href="./${FIRST_CSS_FILE}">`,
		];

		const pathToFiles = CORRECT_PATH_TO_FILES;

		const result = await getInlinedHeadContent(head, pathToFiles);

		expect(result).toEqual(
			expect.arrayContaining([
				expect.stringContaining(`<script type="module">`),
				expect.stringContaining(`<style>`),
			]),
		);
		expect(result).toEqual(
			expect.arrayContaining([
				expect.stringContaining(`/${FIRST_JS_FILE}`),
				expect.stringContaining(`/${FIRST_CSS_FILE}`),
			]),
		);
	});

	it("should inline the content of mixed tag types in the head HTML", async () => {
		const head = [
			'<meta charset="utf-8">',
			'<meta name="viewport" content="width=device-width, initial-scale=1">',
			`<script src="./${FIRST_JS_FILE}" type="module"></script>`,
			`<link rel="stylesheet" href="./${FIRST_CSS_FILE}">`,
			`<script src="./${SECOND_JS_FILE}" type="module"></script>`,
			`<link rel="stylesheet" href="./${SECOND_CSS_FILE}">`,
		];
		const pathToFiles = CORRECT_PATH_TO_FILES;

		const result = await getInlinedHeadContent(head, pathToFiles);

		expect(result).toEqual(
			expect.arrayContaining([
				'<meta charset="utf-8">',
				'<meta name="viewport" content="width=device-width, initial-scale=1">',
				expect.stringContaining(`<script type="module">`),
				expect.stringContaining(`<style>`),
				expect.stringContaining(`<script type="module">`),
				expect.stringContaining(`<style>`),
			]),
		);
		expect(result).toEqual(
			expect.arrayContaining([
				expect.stringContaining(`/${FIRST_JS_FILE}`),
				expect.stringContaining(`/${FIRST_CSS_FILE}`),
				expect.stringContaining(`/${SECOND_JS_FILE}`),
				expect.stringContaining(`/${SECOND_CSS_FILE}`),
			]),
		);
	});

	it("should return the original head HTML if no tags of the given types are found", async () => {
		const head = [
			'<meta charset="utf-8">',
			'<meta name="viewport" content="width=device-width, initial-scale=1">',
		];
		const pathToFiles = CORRECT_PATH_TO_FILES;

		const result = await getInlinedHeadContent(head, pathToFiles);

		expect(result).toEqual(head);
	});

	it("should throw an error if the path to files is invalid", async () => {
		const head = [
			`<script src="./${FIRST_JS_FILE}" type="module"></script>`,
			`<link rel="stylesheet" href="./${FIRST_CSS_FILE}">`,
		];
		const pathToFiles = "/invalid/path";

		await expect(getInlinedHeadContent(head, pathToFiles)).rejects.toThrow(
			expect.stringContaining(pathToFiles),
		);
	});
});
