import type { InlinedTagType } from "../constants";

export const generateInlinedStringForTag = (
	content: string,
	type: InlinedTagType,
) => {
	const attributes = type === "script" ? ' type="module"' : "";
	return `<${type}${attributes}>${content}</${type}>`;
};
