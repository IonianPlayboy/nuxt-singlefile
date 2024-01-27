import { describe, it, expect, vi, afterEach } from "vitest";
import { getInlineContentForTagsType } from "@/src/runtime/utils/getInlineContentForTagsType";

const CORRECT_PATH_TO_FILES = "/path/to/files";
const FIRST_JS_FILE = "test-file.js";
const SECOND_JS_FILE = "index2.js";
const FIRST_CSS_FILE = "index.css";
const SECOND_CSS_FILE = "test-file2.css";

describe("getInlineContentForTagsType", () => {
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

	it("should return the correct inline content for a single script tag", async () => {
		const baseHtml = `<script src="./${FIRST_JS_FILE}" type="module"></script>`;
		const pathToFiles = CORRECT_PATH_TO_FILES;
		const type = "script";

		const result = await getInlineContentForTagsType({
			baseHtml,
			pathToFiles,
			type,
		});

		expect(result).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					tagString: baseHtml,
					content: expect.stringContaining(`/${FIRST_JS_FILE}`),
					type: type,
				}),
			]),
		);
	});

	it("should return the correct inline content for multiple script tags", async () => {
		const baseHtml = `
			<script src="./${FIRST_JS_FILE}" type="module"></script>
			<script src="./${SECOND_JS_FILE}" type="module"></script>
		`;
		const pathToFiles = CORRECT_PATH_TO_FILES;
		const type = "script";

		const result = await getInlineContentForTagsType({
			baseHtml,
			pathToFiles,
			type,
		});

		expect(result).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					tagString: `<script src="./${FIRST_JS_FILE}" type="module"></script>`,
					content: expect.stringContaining(`/${FIRST_JS_FILE}`),
					type: type,
				}),
				expect.objectContaining({
					tagString: `<script src="./${SECOND_JS_FILE}" type="module"></script>`,
					content: expect.stringContaining(`/${SECOND_JS_FILE}`),
					type: type,
				}),
			]),
		);
	});

	it("should return the correct inline content for a single style tag", async () => {
		const baseHtml = `<link href="./${FIRST_CSS_FILE}" rel="stylesheet">`;
		const pathToFiles = CORRECT_PATH_TO_FILES;
		const type = "style";

		const result = await getInlineContentForTagsType({
			baseHtml,
			pathToFiles,
			type,
		});

		expect(result).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					tagString: baseHtml,
					content: expect.stringContaining(`/${FIRST_CSS_FILE}`),
					type: type,
				}),
			]),
		);
	});

	it("should return the correct inline content for multiple style tags", async () => {
		const baseHtml = `
			<link href="./${FIRST_CSS_FILE}" rel="stylesheet">
			<link href="./${SECOND_CSS_FILE}" rel="stylesheet">
		`;
		const pathToFiles = CORRECT_PATH_TO_FILES;
		const type = "style";

		const result = await getInlineContentForTagsType({
			baseHtml,
			pathToFiles,
			type,
		});

		expect(result).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					tagString: `<link href="./${FIRST_CSS_FILE}" rel="stylesheet">`,
					content: expect.stringContaining(`/${FIRST_CSS_FILE}`),
					type: type,
				}),
				expect.objectContaining({
					tagString: `<link href="./${SECOND_CSS_FILE}" rel="stylesheet">`,
					content: expect.stringContaining(`/${SECOND_CSS_FILE}`),
					type: type,
				}),
			]),
		);
	});

	it("should return the correct inline content for mixed tags", async () => {
		const baseHtml = `
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<script src="./${FIRST_JS_FILE}" type="module"></script>
			<link href="./${FIRST_CSS_FILE}" rel="stylesheet">
			<script src="./${SECOND_JS_FILE}" type="module"></script>
			<link href="./${SECOND_CSS_FILE}" rel="stylesheet">
		`;
		const pathToFiles = CORRECT_PATH_TO_FILES;
		const type = "style";

		const result = await getInlineContentForTagsType({
			baseHtml,
			pathToFiles,
			type,
		});

		expect(result).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					tagString: `<link href="./${FIRST_CSS_FILE}" rel="stylesheet">`,
					content: expect.stringContaining(`/${FIRST_CSS_FILE}`),
					type: type,
				}),
				expect.objectContaining({
					tagString: `<link href="./${SECOND_CSS_FILE}" rel="stylesheet">`,
					content: expect.stringContaining(`/${SECOND_CSS_FILE}`),
					type: type,
				}),
			]),
		);
	});

	it("should return an empty array if no tags of the given type are found", async () => {
		const baseHtml = `<link href="./${FIRST_CSS_FILE}" rel="stylesheet">`;
		const pathToFiles = CORRECT_PATH_TO_FILES;
		const type = "script";

		const result = await getInlineContentForTagsType({
			baseHtml,
			pathToFiles,
			type,
		});

		expect(result).toEqual([]);
	});

	it("should throw an error if the path to files is invalid", async () => {
		const baseHtml = `<script src="./${FIRST_JS_FILE}" type="module"></script>`;
		const pathToFiles = "/invalid/path";
		const type = "script";

		await expect(
			getInlineContentForTagsType({ baseHtml, pathToFiles, type }),
		).rejects.toThrow(expect.stringContaining(pathToFiles));
	});

	it("should throw an error if the type is invalid", async () => {
		const baseHtml = `<script src="./${FIRST_JS_FILE}" type="module"></script>`;
		const pathToFiles = CORRECT_PATH_TO_FILES;
		const type = "invalidType";

		await expect(
			// @ts-expect-error
			getInlineContentForTagsType({ baseHtml, pathToFiles, type }),
		).rejects.toThrow(`invalid type: ${type}`);
	});
});
