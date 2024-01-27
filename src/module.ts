import { defineNuxtModule, addServerPlugin, createResolver } from "@nuxt/kit";
import { RUNTIME_BUILD_DIR_KEY } from "./runtime/constants";

// Module options TypeScript interface definition
export interface ModuleOptions {
	buildDirPath?: string;
}

export interface ModuleRuntimeConfig {
	NUXTSINGLEFILE_BUILD_DIR_PATH: string;
}

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: "nuxt-singlefile",
		configKey: "nuxtSingleFile",
	},
	// Default configuration options of the Nuxt module
	defaults: {},
	hooks: {
		"vite:extendConfig": async (config) => {
			config.build ||= {};
			config.build.rollupOptions ||= {};
			config.build.rollupOptions.output ||= {};
			// output typing from rollup allows array, but it should never be relevant
			if (Array.isArray(config.build.rollupOptions.output))
				return null as never;
			// Disable code splitting
			config.build.rollupOptions.output.inlineDynamicImports = true;
		},
		"nitro:config": async (config) => {
			// we only want to prerender the index page
			// so the static preset is the best option
			config.preset = "static";
			config.prerender ||= {};
			config.prerender.ignore ||= [];
			// the 200 and 404 pages are rendered by default in the static preset
			// so we need to ignore them
			config.prerender.ignore.push("/200", "/404");
		},
		"build:manifest": async (manifest) => {
			Object.entries(manifest).forEach(([key, value]) => {
				manifest[key] = {
					...value,
					// Disable preloading since we are inlining the code
					preload: false,
				};
			});
		},
	},
	setup({ buildDirPath }, nuxt) {
		const resolver = createResolver(import.meta.url);
		// Disable SSR
		nuxt.options.ssr = false;

		// Set the router in hash mode for client only routing
		nuxt.options.router.options.hashMode = true;

		// Disable the app manifest since we won't have a server to handle the get request
		nuxt.options.experimental.appManifest = false;

		// Provide the build dir path to the runtime config for the nitro plugin
		nuxt.options.runtimeConfig[RUNTIME_BUILD_DIR_KEY] =
			buildDirPath ?? nuxt.options.buildDir;

		// Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
		addServerPlugin(resolver.resolve("./runtime/nitro-plugin"));
	},
});
