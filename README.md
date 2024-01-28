# Nuxt Single File

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Build your Nuxt app into a single HTML file by inlining all your CSS and JavaScript.

-   [✨ &nbsp;Release Notes](/CHANGELOG.md)
    <!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/nuxt-singlefile?file=playground%2Fapp.vue) -->
    <!-- - [📖 &nbsp;Documentation](https://example.com) -->

<!-- ## Features

-   ⛰ &nbsp;Foo
-   🚠 &nbsp;Bar
-   🌲 &nbsp;Baz -->

## Motivation

This module has been heavily inspired by [vite-plugin-singlefile](https://github.com/richardtallent/vite-plugin-singlefile), and aims to provide the same functionality for Nuxt. It is currently in a very early stage, and is not recommended for production use.

## Quick Setup

1. Add `nuxt-singlefile` dependency to your project

```bash
# Using pnpm
pnpm add -D nuxt-singlefile

# Using yarn
yarn add --dev nuxt-singlefile

# Using npm
npm install --save-dev nuxt-singlefile
```

2. Add `nuxt-singlefile` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
	modules: ["nuxt-singlefile"],
});
```

That's it! You can now use Nuxt Single File in your Nuxt app ✨

## Development

```bash
# Install dependencies
pnpm install

# Generate type stubs
pnpm run dev:prepare

# Develop with the playground
pnpm run dev

# Build the playground
pnpm run dev:build

# Run ESLint
pnpm run lint

# Run Vitest
pnpm run test
pnpm run test:watch

# Release new version
pnpm run release
```

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nuxt-singlefile/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-singlefile
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-singlefile.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-singlefile
[license-src]: https://img.shields.io/npm/l/nuxt-singlefile.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-singlefile
[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
