import { resolve } from "node:path";
import { readFile } from "node:fs/promises";
import {
	regexesPerInlinedType,
	type InlineContentForTagsType,
} from "../constants";

export const getInlineContentForTagsType = async ({
	baseHtml,
	pathToFiles,
	type,
}: InlineContentForTagsType) => {
	if (!regexesPerInlinedType[type])
		return Promise.reject(`invalid type: ${type}`);

	const regex = regexesPerInlinedType[type];

	const matchedTags = [...baseHtml.matchAll(regex)];

	return Promise.all(
		matchedTags.map(async (match) => {
			// the first element is the full match, the second is the capture group
			const [tagString, publicPath] = match;

			const filePath = resolve(pathToFiles, `./${publicPath}`);
			const content = await readFile(filePath, "utf8");

			return { tagString, content, type };
		}),
	);
};
