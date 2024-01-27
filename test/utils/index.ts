import { resolve } from "node:path";
import { loadNuxt, buildNuxt } from "@nuxt/kit";
import { globby } from "globby";
import { memoize } from "lodash-es";

export const buildNuxtApp = async ({ rootDir }: { rootDir: string }) => {
	const nuxt = await loadNuxt({
		cwd: rootDir,
		ready: true,
	});
	await buildNuxt(nuxt);
	return nuxt;
};

export const rawGetOutputFiles = async ({ rootDir }: { rootDir: string }) => {
	const outputFilesPath = resolve(rootDir, ".output");
	const outputFiles = await globby(outputFilesPath);

	return outputFiles;
};

export const getOutputFiles = memoize(rawGetOutputFiles);
