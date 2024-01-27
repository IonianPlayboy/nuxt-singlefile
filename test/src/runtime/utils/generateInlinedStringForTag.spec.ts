import { describe, it, expect } from "vitest";
import { generateInlinedStringForTag } from "@/src/runtime/utils/generateInlinedStringForTag";

describe("generateInlinedStringForTag", () => {
	it("should generate an inlined script tag with the given content", () => {
		const content = "console.log('Hello, world!');";
		const type = "script";

		const result = generateInlinedStringForTag(content, type);

		expect(result).toBe(`<script type="module">${content}</script>`);
	});

	it("should generate an inlined style tag with the given content", () => {
		const content = "body { background-color: #f0f0f0; }";
		const type = "style";

		const result = generateInlinedStringForTag(content, type);

		expect(result).toBe(`<style>${content}</style>`);
	});
});
