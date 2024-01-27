import type { NuxtRenderHTMLContext } from "nuxt/dist/core/runtime/nitro/renderer";

import { inlinedTagTypes } from "../constants";
import {
	generateInlinedStringForTag,
	getInlineContentForTagsType,
} from "./index";

export const getInlinedHeadContent = async (
	head: NuxtRenderHTMLContext["head"],
	pathToFiles: string,
) =>
	Promise.all(
		head.map(async (baseHeadHtml) => {
			const inlinedTagsByType = await Promise.all(
				inlinedTagTypes.map((type) =>
					getInlineContentForTagsType({
						baseHtml: baseHeadHtml,
						pathToFiles,
						type,
					}),
				),
			);
			return inlinedTagsByType
				.flat()
				.reduce(
					(html, { tagString, content, type }) =>
						html.replace(tagString, () =>
							generateInlinedStringForTag(content, type),
						),
					baseHeadHtml,
				);
		}),
	);
