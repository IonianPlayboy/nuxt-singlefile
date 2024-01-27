import type { ModuleRuntimeConfig } from "../module";
import { RUNTIME_BUILD_DIR_KEY } from "./constants";
import { generateSingleFileRenderContext } from "./utils";

export default defineNitroPlugin((nitroApp) => {
	nitroApp.hooks.hook("render:html", async (response) => {
		if (process.env.NODE_ENV !== "prerender") return;

		const runtimeConfig = useRuntimeConfig();
		// TODO: improve runtime config typing
		const buildDir = runtimeConfig[
			RUNTIME_BUILD_DIR_KEY
		] as ModuleRuntimeConfig[typeof RUNTIME_BUILD_DIR_KEY];

		const generatedContext = await generateSingleFileRenderContext(
			response,
			buildDir,
		);

		Object.assign(response, generatedContext);
	});
});
