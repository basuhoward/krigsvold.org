# The Count of Krigsvold

Astro static site for https://krigsvold.org. It consumes the published
`@krigsvold/theme@2.0.0` foundations and `@krigsvold/astro@1.0.0` layout.
Roboto is the body and interface font, Roboto Slab supplies serif and display
roles, and Roboto Mono supplies the public monospace role. All fonts are local.

Use Node 24 or later:

```sh
npm ci
npm run dev
npm run validate
npm run test:browser # first install Chromium: npx playwright install chromium
```

Production output is `dist/`. Both GitHub Pages and Cloudflare build with
Node and npm; Ruby, Bundler, and Jekyll are not required. Cloudflare settings:

- Build command: `npm ci && npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: `/`
- Node version: `24`
- Assets directory: `dist` (set in `wrangler.jsonc`)

Do not restore a root `Gemfile` or Ruby build adapter: Cloudflare detects the
manifest and attempts to install its dependencies before the build command.
The former Jekyll build setup remains available in Git history.

## Editing content

Existing Markdown, YAML data, and image paths remain authoritative. Add pages
at the root, news under `_posts`, fellowship profiles under `_fellows`, and
positions under `_positions`. Front matter controls metadata and explicit
permalinks. `src/lib/content.mjs` reads those sources and renders their known
figure includes and collection listings natively; unsupported template syntax
fails the build. New layouts and components belong in `src/`.

The existing canonical URLs, privacy redirects, named headings, feeds, sitemap,
search index, identity artwork, and analytics consent controls are preserved.
Search bundles Fuse locally and inserts result text through DOM APIs. The
original consent controller is reused unchanged; analytics waits for consent
and respects Global Privacy Control.

## Verification

`npm run validate` checks Astro types, content contracts, all source routes,
metadata, local assets, anchors, search entries, and local font exports. Browser
checks exercise responsive pages, navigation, search, native FAQ controls,
consent, withdrawal, Global Privacy Control, and use without JavaScript. They
stub Google Analytics so test traffic never reaches the service.

The completed migration PR independently built the original Jekyll revision and
compared every legacy HTML route, main text, title, description, canonical URL,
and previously working local reference against Astro. That one-time Ruby-based
comparison has been retired from active CI. Current CI uses the Node validation
and browser checks above; screenshots and the route inventory are attached to
the workflow run for review.

Two documented rendering repairs preserve years already present in the source:
Jekyll misparsed “2022. Researchers” in Polar Ecosystems and “2016. The” in
Warming and Circulation as numbered-list markers, discarding the years from
the prose. Astro renders both as authored. The comparison verifies these exact
source-backed repairs and requires all remaining main text to match.
