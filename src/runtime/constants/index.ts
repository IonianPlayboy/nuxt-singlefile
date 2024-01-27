import type { ModuleRuntimeConfig } from "../../module";

export const RUNTIME_BUILD_DIR_KEY: keyof ModuleRuntimeConfig =
	"NUXTSINGLEFILE_BUILD_DIR_PATH";

// the capture group is the path to the file, relative to the public dir
export const regexesPerInlinedType = {
	script: new RegExp(`<script[^>]*? src="[./]*(.+)"[^>]*></script>`, "g"),
	style: new RegExp(`<link[^>]*? href="[./]*(.+)"[^>]*?>`, "g"),
} as const;

export type InlinedTagType = keyof typeof regexesPerInlinedType;

export const inlinedTagTypes = Object.keys(
	regexesPerInlinedType,
) as Array<InlinedTagType>;

export type InlineContentForTagsType = {
	baseHtml: string;
	pathToFiles: string;
	type: InlinedTagType;
};
