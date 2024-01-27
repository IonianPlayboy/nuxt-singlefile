import type { NuxtRenderHTMLContext } from "nuxt/dist/core/runtime/nitro/renderer";

import { resolve } from "node:path";
import { getInlinedHeadContent } from "./index";

export const generateSingleFileRenderContext = async (
	baseHtmlRenderContext: NuxtRenderHTMLContext,
	buildDir: string,
) => {
	const pathToFiles = resolve(buildDir, "./dist/client");

	const inlinedHead = await getInlinedHeadContent(
		baseHtmlRenderContext.head,
		pathToFiles,
	);

	const result: NuxtRenderHTMLContext = {
		...baseHtmlRenderContext,
		head: inlinedHead,
	};
	return result;
};
